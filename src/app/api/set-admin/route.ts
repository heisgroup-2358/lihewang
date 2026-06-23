import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
