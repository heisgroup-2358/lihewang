import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("pg", () => ({
  default: {
    Pool: vi.fn(),
  },
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: vi.fn(),
}));

vi.mock("@/generated/prisma/client", () => {
  const mockPrismaCtx = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };
  return {
    PrismaClient: class {
      product = mockPrismaCtx.product;
      category = mockPrismaCtx.category;
    },
  };
});

const { prisma } = await import("@/lib/prisma");
const dataService = await import("@/lib/data-service");

const mockProductRow = {
  id: "1",
  name: "白之戀人",
  slug: "ishiya-white-chocolate",
  brand: "石屋製菓",
  origin: "北海道",
  categoryId: "cat1",
  description: "經典手信",
  details: "[]",
  images: "[]",
  retailPrice: 388,
  wholesalePriceL1: 298,
  wholesalePriceL2: 268,
  costPrice: 200,
  stock: 50,
  rating: 4.8,
  reviewCount: 32,
  badge: "人氣熱賣",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getFeaturedProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products ordered by reviewCount with stock > 0", async () => {
    (prisma.product.findMany as any).mockResolvedValue([mockProductRow]);
    const result = await dataService.getFeaturedProducts();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("ishiya-white-chocolate");
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isActive: true, stock: { gt: 0 } },
      orderBy: { reviewCount: "desc" },
      take: 6,
    });
  });

  it("returns mock data on error (fallback)", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getFeaturedProducts();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBeDefined();
  });
});

describe("getAllProducts", () => {
  it("returns all active products ordered by createdAt desc", async () => {
    (prisma.product.findMany as any).mockResolvedValue([mockProductRow]);
    const result = await dataService.getAllProducts();
    expect(result).toHaveLength(1);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  });

  it("returns mock data on error", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getAllProducts();
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("getProductBySlug", () => {
  it("returns product with category info", async () => {
    (prisma.product.findUnique as any).mockResolvedValue(mockProductRow);
    const result = await dataService.getProductBySlug("ishiya-white-chocolate");
    expect(result?.slug).toBe("ishiya-white-chocolate");
    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { slug: "ishiya-white-chocolate" },
      include: { category: true },
    });
  });

  it("returns null on error if slug not in mock data", async () => {
    (prisma.product.findUnique as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getProductBySlug("non-existent-slug-12345");
    expect(result).toBeNull();
  });
});

describe("getCategories", () => {
  it("returns all categories", async () => {
    (prisma.category.findMany as any).mockResolvedValue([
      { id: "1", name: "北海道", slug: "hokkaido", image: null },
    ]);
    const result = await dataService.getCategories();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("hokkaido");
  });

  it("returns fallback categories on error", async () => {
    (prisma.category.findMany as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getCategories();
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result[0].slug).toBe("hokkaido");
  });
});
