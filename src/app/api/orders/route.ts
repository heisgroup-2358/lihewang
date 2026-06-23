import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  slug: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { userId, items, shippingAddress, shippingMethod, paymentMethod, orderType } = await req.json();

    let order;
    let user;

    if (items) {
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      if (!userId) {
        const guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        user = await prisma.user.create({
          data: {
            phone: guestId,
            referralCode: guestId,
          },
        });
      } else {
        user = await prisma.user.findUnique({ where: { id: userId } });
      }

      const productSlugs = items.map((i: OrderItemInput) => i.slug);
      const products = await Promise.all(
        productSlugs.map((slug: string) =>
          prisma.product.findUnique({ where: { slug } }),
        ),
      );

      const missing = products.findIndex((p) => p === null);
      if (missing !== -1) {
        return NextResponse.json(
          { error: `Product not found: ${productSlugs[missing]}` },
          { status: 400 },
        );
      }

      let totalAmount = 0;
      const orderItemsData = items.map((item: OrderItemInput) => {
        const product = products.find((p) => p!.slug === item.slug)!;
        const lineTotal = product.retailPrice * item.quantity;
        totalAmount += lineTotal;
        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.retailPrice,
        };
      });

      order = await prisma.order.create({
        data: {
          userId: user!.id,
          orderType: orderType ?? "retail",
          status: "pending",
          totalAmount,
          shippingAddress,
          shippingMethod,
          paymentMethod: paymentMethod ?? "payme",
          paymentStatus: "unpaid",
          uplineId: user?.uplineId ?? null,
          items: { create: orderItemsData },
        },
      });
    } else {
      if (!userId) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const cart = await prisma.order.findFirst({
        where: { userId, status: "cart" },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      user = await prisma.user.findUnique({ where: { id: userId } });

      order = await prisma.order.update({
        where: { id: cart.id },
        data: {
          orderType: orderType ?? "retail",
          status: "pending",
          shippingAddress,
          shippingMethod,
          paymentMethod: paymentMethod ?? "payme",
          paymentStatus: "unpaid",
          uplineId: user?.uplineId ?? null,
        },
      });
    }

    // Calculate commission if has upline
    if (user?.uplineId) {
      const upline = await prisma.user.findUnique({ where: { id: user.uplineId } });
      if (upline && (upline.role === "wholesale_lv1" || upline.role === "wholesale_lv2")) {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: order.id },
          include: { product: true },
        });

        const costTotal = orderItems.reduce((sum: number, i) => sum + i.product.costPrice * i.quantity, 0);
        const profit = order.totalAmount - costTotal;
        const rate = upline.role === "wholesale_lv2" ? 0.15 : 0.1;
        const commission = Math.round(profit * rate * 100) / 100;

        if (commission > 0) {
          await prisma.commissionTransaction.create({
            data: {
              orderId: order.id,
              uplineId: upline.id,
              downlineId: user.id,
              profitAmount: profit,
              commissionRate: rate,
              amount: commission,
            },
          });

          await prisma.user.update({
            where: { id: upline.id },
            data: { commissionBalance: { increment: commission } },
          });

          await prisma.order.update({
            where: { id: order.id },
            data: { commissionAmount: commission, commissionStatus: "pending" },
          });
        }
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  where.status = { not: "cart" };

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  const { orderId, status } = await req.json();

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json(order);
}
