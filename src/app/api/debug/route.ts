import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbUrl = (process.env.DATABASE_URL || "not set").slice(0, 60);
    const count = await prisma.category.count();
    return NextResponse.json({ dbUrl, categoryCount: count, status: "connected" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown" }, { status: 500 });
  }
}
