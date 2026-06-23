import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dbUrl = (process.env.DATABASE_URL || "not set").slice(0, 60);
    const users = await prisma.user.findFirst();
    return NextResponse.json({ dbUrl, userFound: !!users });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown" }, { status: 500 });
  }
}
