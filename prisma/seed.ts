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
    { name: "零食", slug: "snacks" },
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
    // === Original 禮盒王 Products ===
    { name: "白之戀人 24件入", slug: "ishiya-white-chocolate", brand: "石屋製菓 Ishiya", origin: "北海道", categorySlug: "hokkaido", description: "來自北海道的經典手信。白之戀人採用北海道新鮮牛油製作，夾著白朱古力，入口即溶。", details: JSON.stringify(["內容：白之戀人 24件", "產地：日本北海道", "賞味期限：2025年9月"]), retailPrice: 388, wholesalePriceL1: 298, wholesalePriceL2: 268, costPrice: 200, stock: 50, rating: 4.8, reviewCount: 32, badge: "人氣熱賣" },
    { name: "東京抹茶禮盒", slug: "tokyo-matcha-gift", brand: "京都宇治", origin: "東京", categorySlug: "tokyo", description: "嚴選京都宇治抹茶，配以東京職人製作的和菓子。", details: JSON.stringify(["內容：抹茶粉 50g + 和菓子 8件", "產地：日本京都・東京", "賞味期限：2025年11月"]), retailPrice: 298, wholesalePriceL1: 238, wholesalePriceL2: 218, costPrice: 160, stock: 35, rating: 4.6, reviewCount: 28, badge: "新上市" },
    { name: "京都和菓子禮盒", slug: "kyoto-wagashi", brand: "虎屋", origin: "京都", categorySlug: "kyoto", description: "創業500年の虎屋製和菓子禮盒。", details: JSON.stringify(["內容：和菓子 12件", "產地：日本京都", "賞味期限：2025年8月"]), retailPrice: 458, wholesalePriceL1: 368, wholesalePriceL2: 338, costPrice: 250, stock: 20, rating: 4.7, reviewCount: 18, badge: "季節限定" },
    { name: "Royce 朱古力禮盒", slug: "hokkaido-royce", brand: "Royce", origin: "北海道", categorySlug: "hokkaido", description: "北海道 Royce 的生朱古力系列。", details: JSON.stringify(["內容：生朱古力 20件", "產地：日本北海道", "賞味期限：2025年7月"]), retailPrice: 268, wholesalePriceL1: 208, wholesalePriceL2: 188, costPrice: 140, stock: 0, rating: 4.9, reviewCount: 45, badge: "人氣熱賣" },
    { name: "函館甜品禮盒", slug: "hakodate-sweets", brand: "函館菓子工房", origin: "北海道", categorySlug: "hokkaido", description: "函館人氣甜品店限定禮盒。", details: JSON.stringify(["內容：芝士蛋糕 1個 + 布甸 2個 + 曲奇 6件", "產地：日本北海道函館"]), retailPrice: 328, wholesalePriceL1: 258, wholesalePriceL2: 238, costPrice: 180, stock: 15, rating: 4.5, reviewCount: 12 },
    { name: "季節限定・櫻花禮盒", slug: "seasonal-sakura", brand: "多間名店合作", origin: "東京", categorySlug: "seasonal", description: "春季限定櫻花主題禮盒。", details: JSON.stringify(["內容：櫻花餅 4件 + 櫻花朱古力 6件 + 櫻花曲奇 6件", "產地：日本東京"]), retailPrice: 528, wholesalePriceL1: 428, wholesalePriceL2: 398, costPrice: 300, stock: 10, rating: 4.9, reviewCount: 8, badge: "季節限定" },

    // === WARAWARA 零食 ===
    { name: "Afternoon tea living Cold Brew Iced Tea 冷泡冰茶", slug: "afternoon-tea-cold-brew-iced-tea", brand: "Afternoon tea living", origin: "日本", categorySlug: "snacks", description: "Afternoon tea living推出製作簡單又美味的冷泡冰茶！提供多種茶和水果口味組合供您享用。", details: JSON.stringify(["產地：日本", "多種口味可選"]), retailPrice: 108, wholesalePriceL1: 88, wholesalePriceL2: 78, costPrice: 60, stock: 30, rating: 4.5, reviewCount: 12 },
    { name: "でんすん堂 蝦餅(牛油果芝士味/明太子芝士味)", slug: "densundo-shrimp-crackers", brand: "でんすん堂", origin: "日本", categorySlug: "snacks", description: "這款點心將日本傳統蝦仙貝的清脆，與現代濃郁的西式風味完美結合。", details: JSON.stringify(["口味：牛油果芝士 / 明太子芝士", "產地：日本"]), retailPrice: 55, wholesalePriceL1: 45, wholesalePriceL2: 40, costPrice: 30, stock: 50, rating: 4.3, reviewCount: 8 },
    { name: "7-11 x BUTTER STATE's 士多啤梨味火山曲奇", slug: "711-butter-state-strawberry-cookie", brand: "BUTTER STATE's", origin: "日本", categorySlug: "snacks", description: "濃鬱的草莓巧克力淋面，相當於40%的新鮮草莓，慷慨地淋在餅乾上。", details: JSON.stringify(["內容：3塊", "產地：日本"]), retailPrice: 36, wholesalePriceL1: 28, wholesalePriceL2: 25, costPrice: 18, stock: 100, rating: 4.2, reviewCount: 15 },
    { name: "7-11 x SBT 士多啤梨奶油夾心餅", slug: "711-sbt-strawberry-cream-sandwich", brand: "Sugar Butter Tree", origin: "日本", categorySlug: "snacks", description: "這款草莓巧克力濃鬱香醇，草莓含量高達45%！", details: JSON.stringify(["內容：3塊", "產地：日本"]), retailPrice: 35, wholesalePriceL1: 28, wholesalePriceL2: 25, costPrice: 18, stock: 100, rating: 4.1, reviewCount: 10 },
    { name: "|夏季限定| SUGAR BUTTER TREE 麝香提子朱古力味+原味奶油夾心餅", slug: "sugar-butter-tree-muscat-grape-set", brand: "Sugar Butter Tree", origin: "日本", categorySlug: "seasonal", description: "一款融入日本國產麝香葡萄汁的乳白巧克力。夾在五種不同原料製成的香濃穀物麵團之間。", details: JSON.stringify(["內容：麝香提子味 + 原味各一盒", "產地：日本", "夏季限定"]), retailPrice: 170, wholesalePriceL1: 140, wholesalePriceL2: 125, costPrice: 95, stock: 20, rating: 4.7, reviewCount: 6, badge: "夏季限定" },
    { name: "|夏季限定| SUGAR BUTTER TREE 麝香提子朱古力味奶油夾心餅", slug: "sugar-butter-tree-muscat-grape-single", brand: "Sugar Butter Tree", origin: "日本", categorySlug: "seasonal", description: "一款融入日本國產麝香葡萄汁的乳白巧克力。在炎熱的季節裡，搭配一杯冰茶，享受一段輕鬆愜意的時光。", details: JSON.stringify(["內容：麝香提子味", "產地：日本", "夏季限定"]), retailPrice: 98, wholesalePriceL1: 80, wholesalePriceL2: 72, costPrice: 55, stock: 25, rating: 4.6, reviewCount: 5, badge: "夏季限定" },
    { name: "日本7-11 Sumire 札幌濃鬱味噌拉麵", slug: "711-sumire-sapporo-miso-ramen", brand: "7-11", origin: "日本", categorySlug: "snacks", description: "Threads大推！用生命推呢個杯麵！湯底勁濃，超掛麵，麵條又煙韌。", details: JSON.stringify(["容量：145g", "產地：日本"]), retailPrice: 48, wholesalePriceL1: 38, wholesalePriceL2: 34, costPrice: 25, stock: 60, rating: 4.4, reviewCount: 22 },
    { name: "DROOLY 蜂蜜芝士朱古力夾心餅", slug: "drooly-honey-cheese-chocolate-sandwich", brand: "DROOLY", origin: "日本", categorySlug: "snacks", description: "香濃的卡門貝爾芝士淋上厚厚的一層蜂蜜，各種芝士和蜂蜜的甜香交織在一起。", details: JSON.stringify(["產地：日本", "多種規格可選"]), retailPrice: 110, wholesalePriceL1: 88, wholesalePriceL2: 78, costPrice: 60, stock: 40, rating: 4.5, reviewCount: 14 },
    { name: "薫るバターsabrina 花朵奶油千層酥", slug: "sabrina-flower-cream-mille-feuille", brand: "sabrina", origin: "日本", categorySlug: "snacks", description: "嚴選世界各地優質奶油，人氣商品No.1推薦花朵奶油千層酥，使用來自法國夏朗德地區所出產的頂級牛油。", details: JSON.stringify(["產地：日本", "多種規格可選"]), retailPrice: 110, wholesalePriceL1: 88, wholesalePriceL2: 78, costPrice: 60, stock: 35, rating: 4.6, reviewCount: 18 },
    { name: "DROOLY 蜂蜜芝士費南雪【人氣】", slug: "drooly-honey-cheese-feuilletine", brand: "DROOLY", origin: "日本", categorySlug: "snacks", description: "品牌以熊為LOGO，DROOLY最愛的吃法是芝士淋上厚厚的一層蜂蜜。", details: JSON.stringify(["產地：日本", "多種規格可選"]), retailPrice: 98, wholesalePriceL1: 78, wholesalePriceL2: 68, costPrice: 50, stock: 45, rating: 4.7, reviewCount: 20, badge: "人氣" },
    { name: "現貨！PISTA &TOKYO 開心果夾心餅乾5件裝", slug: "pista-tokyo-pistachio-sandwich-cookies", brand: "PISTA & TOKYO", origin: "東京", categorySlug: "tokyo", description: "開心果甜品專賣店「PISTA&TOKYO」的招牌產品！五層夾心餅乾，夾著鹹味開心果餅乾和開心果口味朱古力。", details: JSON.stringify(["內容：5件裝", "產地：日本東京"]), retailPrice: 120, wholesalePriceL1: 98, wholesalePriceL2: 88, costPrice: 68, stock: 30, rating: 4.8, reviewCount: 25, badge: "現貨" },
    { name: "ROYCE 開心果朱古力BAR", slug: "royce-pistachio-chocolate-bar", brand: "Royce", origin: "北海道", categorySlug: "hokkaido", description: "以牛奶巧克力包裹整顆鹹味烤開心果，表面撒上切碎的烤開心果、蔓越莓乾等。", details: JSON.stringify(["產地：日本北海道", "期間限定"]), retailPrice: 138, wholesalePriceL1: 110, wholesalePriceL2: 98, costPrice: 75, stock: 15, rating: 4.6, reviewCount: 8, badge: "期間限定" },
    { name: "【季節限定】Yoku Moku蛋卷 - 宇治抹茶味", slug: "yoku-moku-matcha-egg-rolls", brand: "Yoku Moku", origin: "東京", categorySlug: "seasonal", description: "Yoku Moku經典蛋卷，宇治抹茶味季節限定。", details: JSON.stringify(["產地：日本東京", "季節限定"]), retailPrice: 218, wholesalePriceL1: 178, wholesalePriceL2: 158, costPrice: 120, stock: 10, rating: 4.8, reviewCount: 12, badge: "季節限定" },
    { name: "SUGAR BUTTER TREE 炭火朱古力味<冬季限定>", slug: "sugar-butter-tree-charcoal-chocolate", brand: "Sugar Butter Tree", origin: "日本", categorySlug: "seasonal", description: "每年最受歡迎口味回歸！奢華的夾心餅，淋上濃鬱的炭烤巧克力。", details: JSON.stringify(["產地：日本", "冬季限定"]), retailPrice: 98, wholesalePriceL1: 78, wholesalePriceL2: 68, costPrice: 50, stock: 0, rating: 4.5, reviewCount: 10, badge: "冬季限定" },
  ];

  for (const p of products) {
    const { categorySlug, ...productData } = p;
    const data = { ...productData, categoryId: catMap[categorySlug], images: "[]" };

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({ where: { slug: p.slug }, data });
    } else {
      await prisma.product.create({ data });
    }
  }

  console.log(`✅ Seed completed! ${products.length} products imported.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
