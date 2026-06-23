/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("pg", () => ({ default: { Pool: vi.fn() } }));
vi.mock("@prisma/adapter-pg", () => ({ PrismaPg: vi.fn() }));

vi.mock("@/generated/prisma/client", () => {
  const ctx = {
    product: { findMany: vi.fn() },
    category: { findUnique: vi.fn() },
  };
  return { PrismaClient: class { product = ctx.product; category = ctx.category } };
});

const { prisma } = await import("@/lib/prisma");
const { GET } = await import("../products/route");

const mockProduct = { id: "1", name: "Test", slug: "test", retailPrice: 100, brand: "B", origin: "JP" };

describe("GET /api/products", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all products with default sort", async () => {
    (prisma.product.findMany as any).mockResolvedValue([mockProduct]);
    const res = await GET(new Request("http://localhost:3000/api/products"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  });

  it("filters by category slug", async () => {
    (prisma.category.findUnique as any).mockResolvedValue({ id: "cat1" });
    (prisma.product.findMany as any).mockResolvedValue([]);
    const res = await GET(new Request("http://localhost:3000/api/products?category=hokkaido"));
    expect(res.status).toBe(200);
    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { slug: "hokkaido" } });
  });

  it("filters by search term", async () => {
    (prisma.product.findMany as any).mockResolvedValue([]);
    await GET(new Request("http://localhost:3000/api/products?search=抹茶"));
    const call = (prisma.product.findMany as any).mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
    expect(call.where.OR[0]).toEqual({ name: { contains: "抹茶" } });
  });

  it("handles price range filter", async () => {
    (prisma.product.findMany as any).mockResolvedValue([]);
    await GET(new Request("http://localhost:3000/api/products?minPrice=100&maxPrice=500"));
    const call = (prisma.product.findMany as any).mock.calls[0][0];
    expect(call.where.retailPrice.gte).toBe(100);
    expect(call.where.retailPrice.lte).toBe(500);
  });

  it("supports price_asc sort", async () => {
    (prisma.product.findMany as any).mockResolvedValue([]);
    await GET(new Request("http://localhost:3000/api/products?sort=price_asc"));
    const call = (prisma.product.findMany as any).mock.calls[0][0];
    expect(call.orderBy).toEqual({ retailPrice: "asc" });
  });

  it("returns mock data on error", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const res = await GET(new Request("http://localhost:3000/api/products"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });
});
