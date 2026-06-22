import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  const { userId } = await req.json();

  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.referralCode || user.referralCode === "") {
    const code = generateReferralCode();
    user = await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
  }

  return NextResponse.json({ referralCode: user.referralCode });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const uplineId = searchParams.get("uplineId");

  if (!uplineId) {
    return NextResponse.json({ error: "uplineId required" }, { status: 400 });
  }

  const downlines = await prisma.user.findMany({
    where: { uplineId },
    include: {
      _count: { select: { orders: { where: { status: { not: "cart" } } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(downlines);
}

export async function PATCH(req: Request) {
  const { referralCode, newUserId } = await req.json();

  const upline = await prisma.user.findUnique({ where: { referralCode } });
  if (!upline) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: newUserId },
    data: { uplineId: upline.id },
  });

  return NextResponse.json({ success: true, uplineId: upline.id });
}
