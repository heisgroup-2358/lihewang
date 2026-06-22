import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { applicationId, approvedLevel, reviewerId } = await req.json();

  const app = await prisma.wholesaleApplication.update({
    where: { id: applicationId },
    data: {
      status: "approved",
      approvedLevel,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
  });

  await prisma.user.update({
    where: { id: app.userId },
    data: { role: approvedLevel === "lv2" ? "wholesale_lv2" : "wholesale_lv1" },
  });

  return NextResponse.json({ success: true });
}
