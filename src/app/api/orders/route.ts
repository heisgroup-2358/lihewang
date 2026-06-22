import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, shippingAddress, shippingMethod, paymentMethod, orderType } = await req.json();

  const cart = await prisma.order.findFirst({
    where: { userId, status: "cart" },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const updated = await prisma.order.update({
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

  // Calculate commission if has upline
  if (user?.uplineId) {
    const upline = await prisma.user.findUnique({ where: { id: user.uplineId } });
    if (upline && (upline.role === "wholesale_lv1" || upline.role === "wholesale_lv2")) {
      const items = await prisma.orderItem.findMany({
        where: { orderId: cart.id },
        include: { product: true },
      });

      const costTotal = items.reduce((sum, i) => sum + i.product.costPrice * i.quantity, 0);
      const profit = updated.totalAmount - costTotal;
      const rate = upline.role === "wholesale_lv2" ? 0.15 : 0.1;
      const commission = Math.round(profit * rate * 100) / 100;

      if (commission > 0) {
        await prisma.commissionTransaction.create({
          data: {
            orderId: updated.id,
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
          where: { id: updated.id },
          data: { commissionAmount: commission, commissionStatus: "pending" },
        });
      }
    }
  }

  return NextResponse.json({ success: true, orderId: updated.id });
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
