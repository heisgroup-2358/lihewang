export interface Product {
  slug: string;
  name: string;
  brand: string;
  origin: string;
  category: string;
  price: number;
  wholesalePriceL1: number;
  wholesalePriceL2: number;
  costPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  details: string[];
  images: string[];
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    slug: "ishiya-white-chocolate",
    name: "白之戀人 24件入",
    brand: "石屋製菓 Ishiya",
    origin: "北海道",
    category: "hokkaido",
    price: 388,
    wholesalePriceL1: 298,
    wholesalePriceL2: 268,
    costPrice: 200,
    rating: 4.8,
    reviewCount: 32,
    badge: "人氣熱賣",
    description:
      "來自北海道的經典手信。白之戀人採用北海道新鮮牛油製作，夾著白朱古力，入口即溶。每件獨立包裝，送禮自用皆宜。",
    details: [
      "內容：白之戀人 24件",
      "產地：日本北海道",
      "賞味期限：2025年9月",
      "保存方法：避免高溫潮濕，28°C以下保存",
      "包裝：獨立包裝禮盒裝",
    ],
    images: [],
    stock: 50,
  },
  {
    slug: "tokyo-matcha-gift",
    name: "東京抹茶禮盒",
    brand: "京都宇治",
    origin: "東京",
    category: "tokyo",
    price: 298,
    wholesalePriceL1: 238,
    wholesalePriceL2: 218,
    costPrice: 160,
    rating: 4.6,
    reviewCount: 28,
    badge: "新上市",
    description:
      "嚴選京都宇治抹茶，配以東京職人製作的和菓子。一盒嚐盡春日氣息。",
    details: [
      "內容：抹茶粉 50g + 和菓子 8件",
      "產地：日本京都・東京",
      "賞味期限：2025年11月",
      "保存方法：陰涼乾爽處保存",
    ],
    images: [],
    stock: 35,
  },
  {
    slug: "kyoto-wagashi",
    name: "京都和菓子禮盒",
    brand: "虎屋",
    origin: "京都",
    category: "kyoto",
    price: 458,
    wholesalePriceL1: 368,
    wholesalePriceL2: 338,
    costPrice: 250,
    rating: 4.7,
    reviewCount: 18,
    description:
      "創業500年の虎屋製和菓子禮盒。每一件都由職人親手製作，傳遞京都的四季之美。",
    details: [
      "內容：和菓子 12件 (4種口味各3件)",
      "產地：日本京都",
      "賞味期限：2025年8月",
      "保存方法：常溫保存，開封後請盡快食用",
    ],
    images: [],
    stock: 20,
  },
  {
    slug: "hokkaido-royce",
    name: "Royce 朱古力禮盒",
    brand: "Royce",
    origin: "北海道",
    category: "hokkaido",
    price: 268,
    wholesalePriceL1: 208,
    wholesalePriceL2: 188,
    costPrice: 140,
    rating: 4.9,
    reviewCount: 45,
    badge: "人氣熱賣",
    description:
      "北海道 Royce 的生朱古力系列。使用北海道新鮮忌廉，口感絲滑細膩。",
    details: [
      "內容：生朱古力 20件 (2種口味各10件)",
      "產地：日本北海道",
      "賞味期限：2025年7月",
      "保存方法：10°C以下冷藏保存",
    ],
    images: [],
    stock: 0,
  },
  {
    slug: "hakodate-sweets",
    name: "函館甜品禮盒",
    brand: "函館菓子工房",
    origin: "北海道",
    category: "hokkaido",
    price: 328,
    wholesalePriceL1: 258,
    wholesalePriceL2: 238,
    costPrice: 180,
    rating: 4.5,
    reviewCount: 12,
    description:
      "函館人氣甜品店限定禮盒。包含芝士蛋糕、布甸及曲奇，一次過品嚐函館的味道。",
    details: [
      "內容：芝士蛋糕 1個 + 布甸 2個 + 曲奇 6件",
      "產地：日本北海道函館",
      "賞味期限：2025年6月",
      "保存方法：冷藏保存 (4°C)",
    ],
    images: [],
    stock: 15,
  },
  {
    slug: "seasonal-sakura",
    name: "季節限定・櫻花禮盒",
    brand: "多間名店合作",
    origin: "東京",
    category: "seasonal",
    price: 528,
    wholesalePriceL1: 428,
    wholesalePriceL2: 398,
    costPrice: 300,
    rating: 4.9,
    reviewCount: 8,
    badge: "季節限定",
    description:
      "春季限定櫻花主題禮盒。集合東京多間名店的櫻花味甜品，期間限定發售。",
    details: [
      "內容：櫻花餅 4件 + 櫻花朱古力 6件 + 櫻花曲奇 6件",
      "產地：日本東京",
      "賞味期限：2025年5月",
      "保存方法：常溫保存",
    ],
    images: [],
    stock: 10,
  },
];
