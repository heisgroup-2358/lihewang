import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const origins = await prisma.origin.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(origins);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const origin = await prisma.origin.create({ data: { name, slug } });
    return NextResponse.json(origin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create origin" }, { status: 500 });
  }
}
