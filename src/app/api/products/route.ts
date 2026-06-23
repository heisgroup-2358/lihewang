import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const origin = searchParams.get("origin");

    const where: Record<string, unknown> = { isActive: true };

    if (category && category !== "all") {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.retailPrice = {};
      if (minPrice) (where.retailPrice as Record<string, unknown>).gte = Number(minPrice);
      if (maxPrice) (where.retailPrice as Record<string, unknown>).lte = Number(maxPrice);
    }

    if (origin) {
      where.origin = origin;
    }

    const orderBy: Record<string, string> =
      sort === "price_asc"
        ? { retailPrice: "asc" }
        : sort === "price_desc"
          ? { retailPrice: "desc" }
          : sort === "bestseller"
            ? { reviewCount: "desc" }
            : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch {
    const { PRODUCTS } = await import("@/lib/mock-data");
    return NextResponse.json(PRODUCTS);
  }
}
