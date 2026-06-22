import { PrismaClient } from "../src/generated/prisma";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { name: "北海道", slug: "hokkaido" },
    { name: "東京", slug: "tokyo" },
    { name: "京都", slug: "kyoto" },
    { name: "季節限定", slug: "seasonal" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (c) catMap[cat.slug] = c.id;
  }

  const products = [
    { name: "白之戀人 24件入", slug: "ishiya-white-chocolate", brand: "石屋製菓 Ishiya", origin: "北海道", categorySlug: "hokkaido", description: "來自北海道的經典手信。白之戀人採用北海道新鮮牛油製作，夾著白朱古力，入口即溶。", details: JSON.stringify(["內容：白之戀人 24件", "產地：日本北海道", "賞味期限：2025年9月", "保存方法：避免高溫潮濕"]), retailPrice: 388, wholesalePriceL1: 298, wholesalePriceL2: 268, costPrice: 200, stock: 50, rating: 4.8, reviewCount: 32, badge: "人氣熱賣" },
    { name: "東京抹茶禮盒", slug: "tokyo-matcha-gift", brand: "京都宇治", origin: "東京", categorySlug: "tokyo", description: "嚴選京都宇治抹茶，配以東京職人製作的和菓子。", details: JSON.stringify(["內容：抹茶粉 50g + 和菓子 8件", "產地：日本京都・東京", "賞味期限：2025年11月"]), retailPrice: 298, wholesalePriceL1: 238, wholesalePriceL2: 218, costPrice: 160, stock: 35, rating: 4.6, reviewCount: 28, badge: "新上市" },
    { name: "京都和菓子禮盒", slug: "kyoto-wagashi", brand: "虎屋", origin: "京都", categorySlug: "kyoto", description: "創業500年の虎屋製和菓子禮盒。", details: JSON.stringify(["內容：和菓子 12件", "產地：日本京都", "賞味期限：2025年8月"]), retailPrice: 458, wholesalePriceL1: 368, wholesalePriceL2: 338, costPrice: 250, stock: 20, rating: 4.7, reviewCount: 18 },
    { name: "Royce 朱古力禮盒", slug: "hokkaido-royce", brand: "Royce", origin: "北海道", categorySlug: "hokkaido", description: "北海道 Royce 的生朱古力系列。", details: JSON.stringify(["內容：生朱古力 20件", "產地：日本北海道", "賞味期限：2025年7月"]), retailPrice: 268, wholesalePriceL1: 208, wholesalePriceL2: 188, costPrice: 140, stock: 0, rating: 4.9, reviewCount: 45, badge: "人氣熱賣" },
    { name: "函館甜品禮盒", slug: "hakodate-sweets", brand: "函館菓子工房", origin: "北海道", categorySlug: "hokkaido", description: "函館人氣甜品店限定禮盒。", details: JSON.stringify(["內容：芝士蛋糕 1個 + 布甸 2個 + 曲奇 6件", "產地：日本北海道函館"]), retailPrice: 328, wholesalePriceL1: 258, wholesalePriceL2: 238, costPrice: 180, stock: 15, rating: 4.5, reviewCount: 12 },
    { name: "季節限定・櫻花禮盒", slug: "seasonal-sakura", brand: "多間名店合作", origin: "東京", categorySlug: "seasonal", description: "春季限定櫻花主題禮盒。", details: JSON.stringify(["內容：櫻花餅 4件 + 櫻花朱古力 6件 + 櫻花曲奇 6件", "產地：日本東京"]), retailPrice: 528, wholesalePriceL1: 428, wholesalePriceL2: 398, costPrice: 300, stock: 10, rating: 4.9, reviewCount: 8, badge: "季節限定" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        origin: p.origin,
        categoryId: catMap[p.categorySlug],
        description: p.description,
        details: p.details,
        images: "[]",
        retailPrice: p.retailPrice,
        wholesalePriceL1: p.wholesalePriceL1,
        wholesalePriceL2: p.wholesalePriceL2,
        costPrice: p.costPrice,
        stock: p.stock,
        rating: p.rating,
        reviewCount: p.reviewCount,
        badge: p.badge ?? null,
      },
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
