import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(brands);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { name, code } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const brand = await prisma.brand.create({ data: { name, slug, code: code || slug } });
    return NextResponse.json(brand, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}
