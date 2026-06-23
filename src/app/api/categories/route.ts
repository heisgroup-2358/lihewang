import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({ data: body });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch {
    const fallback = [
      { id: "1", name: "北海道", slug: "hokkaido", image: null, _count: { products: 4 } },
      { id: "2", name: "東京", slug: "tokyo", image: null, _count: { products: 3 } },
      { id: "3", name: "京都", slug: "kyoto", image: null, _count: { products: 1 } },
      { id: "4", name: "季節限定", slug: "seasonal", image: null, _count: { products: 5 } },
      { id: "5", name: "零食", slug: "snacks", image: null, _count: { products: 7 } },
    ];
    return NextResponse.json(fallback);
  }
}
