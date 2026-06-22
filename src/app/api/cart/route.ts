import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const cartItems = await prisma.orderItem.findMany({
    where: {
      order: { userId, status: "cart" },
    },
    include: { product: true },
  });

  return NextResponse.json(cartItems);
}

export async function POST(req: Request) {
  const { userId, productId, quantity } = await req.json();

  let cart = await prisma.order.findFirst({
    where: { userId, status: "cart" },
  });

  if (!cart) {
    cart = await prisma.order.create({
      data: {
        userId,
        orderType: "retail",
        status: "cart",
        totalAmount: 0,
        shippingAddress: "",
        shippingMethod: "",
      },
    });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.orderItem.findFirst({
    where: { orderId: cart.id, productId },
  });

  if (existing) {
    await prisma.orderItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.orderItem.create({
      data: {
        orderId: cart.id,
        productId,
        quantity,
        unitPrice: product.retailPrice,
      },
    });
  }

  const items = await prisma.orderItem.findMany({ where: { orderId: cart.id } });
  const total = (items as any[]).reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0);
  await prisma.order.update({ where: { id: cart.id }, data: { totalAmount: total } });

  return NextResponse.json({ success: true, cartId: cart.id, total });
}

export async function PATCH(req: Request) {
  const { itemId, quantity } = await req.json();

  const item = await prisma.orderItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  const items = await prisma.orderItem.findMany({ where: { orderId: item.orderId } });
  const total = (items as any[]).reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0);
  await prisma.order.update({ where: { id: item.orderId }, data: { totalAmount: total } });

  return NextResponse.json({ success: true, total });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 });
  }

  const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await prisma.orderItem.delete({ where: { id: itemId } });

  const items = await prisma.orderItem.findMany({ where: { orderId: item.orderId } });
  const total = (items as any[]).reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0);
  await prisma.order.update({ where: { id: item.orderId }, data: { totalAmount: total } });

  return NextResponse.json({ success: true, total });
}
