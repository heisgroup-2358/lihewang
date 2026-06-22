import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const priceTier =
    user?.role === "wholesale_lv2"
      ? "wholesale_lv2"
      : user?.role === "wholesale_lv1"
        ? "wholesale_lv1"
        : "retail";

  return NextResponse.json({ tier: priceTier, role: user?.role });
}
