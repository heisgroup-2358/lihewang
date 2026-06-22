import { prisma } from "./prisma";
import { PRODUCTS } from "./mock-data";

export type DbProduct = {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  origin: string;
  category?: { slug: string; name: string } | { slug: string; name: string };
  categorySlug?: string;
  categoryName?: string;
  retailPrice: number;
  wholesalePriceL1: number;
  wholesalePriceL2: number;
  costPrice: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
  description: string;
  details: string;
  stock: number;
  isActive?: boolean;
  images?: string;
};

function mockToDb(p: (typeof PRODUCTS)[0]): DbProduct {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    origin: p.origin,
    category: { slug: p.category, name: p.category },
    retailPrice: p.price,
    wholesalePriceL1: p.wholesalePriceL1,
    wholesalePriceL2: p.wholesalePriceL2,
    costPrice: p.costPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge ?? null,
    description: p.description,
    details: JSON.stringify(p.details),
    stock: p.stock,
    images: "[]",
  };
}

export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return PRODUCTS.map(mockToDb);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch {
    const p = PRODUCTS.find((p) => p.slug === slug);
    if (!p) return null;
    return mockToDb(p);
  }
}

export async function getRelatedProducts(slug: string, categorySlug: string) {
  try {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!cat) return [];
    return await prisma.product.findMany({
      where: { categoryId: cat.id, slug: { not: slug }, isActive: true },
      take: 3,
    });
  } catch {
    return PRODUCTS.filter((p) => p.category === categorySlug && p.slug !== slug)
      .slice(0, 3)
      .map(mockToDb);
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, stock: { gt: 0 } },
      orderBy: { reviewCount: "desc" },
      take: 6,
    });
  } catch {
    return PRODUCTS.filter((p) => p.stock > 0)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6)
      .map(mockToDb);
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany();
  } catch {
    return [
      { id: "1", name: "北海道", slug: "hokkaido", image: null },
      { id: "2", name: "東京", slug: "tokyo", image: null },
      { id: "3", name: "京都", slug: "kyoto", image: null },
      { id: "4", name: "季節限定", slug: "seasonal", image: null },
      { id: "5", name: "零食", slug: "snacks", image: null },
    ];
  }
}
