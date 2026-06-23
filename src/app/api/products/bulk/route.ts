import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(",").map((h) => h.trim());

    const results = { success: 0, errors: [] as string[] };

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(",").map((v) => v.trim());
        const row = Object.fromEntries(headers.map((h, j) => [h, values[j]]));

        const cat = await prisma.category.findUnique({
          where: { slug: row.categorySlug },
        });
        if (!cat) {
          results.errors.push(`Row ${i + 2}: category not found`);
          continue;
        }

        await prisma.product.create({
          data: {
            name: row.name,
            slug: row.slug,
            brand: row.brand,
            origin: row.origin,
            categoryId: cat.id,
            description: row.description,
            retailPrice: parseFloat(row.retailPrice),
            wholesalePriceL1: parseFloat(row.wholesalePriceL1),
            wholesalePriceL2: parseFloat(row.wholesalePriceL2),
            costPrice: parseFloat(row.costPrice),
            stock: parseInt(row.stock) || 0,
            badge: row.badge || null,
            images: row.imageUrl ? JSON.stringify([row.imageUrl]) : "[]",
          },
        });
        results.success++;
      } catch (e: unknown) {
        results.errors.push(`Row ${i + 2}: ${e instanceof Error ? e.message : "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bulk upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
