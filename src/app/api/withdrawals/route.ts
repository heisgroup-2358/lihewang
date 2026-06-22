import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, amount, bankName, bankAccountName, bankAccountNo } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.commissionBalance < amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const withdrawal = await prisma.withdrawalRequest.create({
    data: { userId, amount, bankName, bankAccountName, bankAccountNo },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { commissionBalance: { decrement: amount } },
  });

  return NextResponse.json({ success: true, withdrawalId: withdrawal.id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;

  const withdrawals = await prisma.withdrawalRequest.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(withdrawals);
}

export async function PATCH(req: Request) {
  const { withdrawalId, status, adminNote, processedBy } = await req.json();

  const withdrawal = await prisma.withdrawalRequest.update({
    where: { id: withdrawalId },
    data: {
      status,
      adminNote,
      processedBy,
      processedAt: status === "completed" ? new Date() : undefined,
    },
  });

  if (status === "rejected") {
    await prisma.user.update({
      where: { id: withdrawal.userId },
      data: { commissionBalance: { increment: withdrawal.amount } },
    });
  }

  return NextResponse.json({ success: true });
}
