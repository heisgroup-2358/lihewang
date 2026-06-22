import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const costTotal = (order.items as any[]).reduce((sum: number, i: any) => sum + i.product.costPrice * i.quantity, 0);
  const profit = order.totalAmount - costTotal;

  return NextResponse.json({
    orderId: order.id,
    totalAmount: order.totalAmount,
    costTotal,
    profit,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uplineId = searchParams.get("uplineId");
  const downlineId = searchParams.get("downlineId");

  const where: Record<string, unknown> = {};
  if (uplineId) where.uplineId = uplineId;
  if (downlineId) where.downlineId = downlineId;

  const txns = await prisma.commissionTransaction.findMany({
    where,
    include: { upline: true, downline: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(txns);
}
