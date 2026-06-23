import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("pg", () => ({ default: { Pool: vi.fn() } }));
vi.mock("@prisma/adapter-pg", () => ({ PrismaPg: vi.fn() }));

const mockPrismaCtx = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  product: {
    findUnique: vi.fn(),
  },
  order: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  orderItem: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  commissionTransaction: {
    create: vi.fn(),
  },
};

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient: { prototype: mockPrismaCtx },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrismaCtx }));

const { POST } = await import("../orders/route");

const mockProduct = {
  id: "prod-1",
  slug: "ishiya-white-chocolate",
  name: "白之戀人",
  retailPrice: 388,
  costPrice: 200,
};

const mockItem = { slug: "ishiya-white-chocolate", quantity: 2 };

describe("POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates guest user and order when no userId provided", async () => {
    mockPrismaCtx.product.findUnique.mockResolvedValue(mockProduct);
    mockPrismaCtx.user.create.mockResolvedValue({ id: "guest-1", uplineId: null });
    mockPrismaCtx.order.create.mockResolvedValue({ id: "order-1", totalAmount: 776 });
    mockPrismaCtx.user.findUnique.mockResolvedValue({ id: "guest-1" });

    const body = {
      items: [mockItem],
      shippingAddress: "Causeway Bay, Hong Kong",
      shippingMethod: "pickup",
      paymentMethod: "payme",
      orderType: "retail",
    };

    const res = await POST(new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.orderId).toBe("order-1");
    expect(mockPrismaCtx.user.create).toHaveBeenCalled();
    expect(mockPrismaCtx.product.findUnique).toHaveBeenCalledWith({
      where: { slug: "ishiya-white-chocolate" },
    });
  });

  it("returns 400 when cart is empty", async () => {
    const body = {
      items: [],
      shippingAddress: "Test",
      shippingMethod: "pickup",
    };

    const res = await POST(new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Cart is empty");
  });

  it("returns 400 when a product slug is not found", async () => {
    mockPrismaCtx.product.findUnique.mockResolvedValue(null);
    mockPrismaCtx.user.create.mockResolvedValue({ id: "guest-1" });

    const body = {
      items: [{ slug: "non-existent", quantity: 1 }],
      shippingAddress: "Test",
      shippingMethod: "pickup",
    };

    const res = await POST(new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("not found");
  });

  it("handles error gracefully", async () => {
    mockPrismaCtx.product.findUnique.mockRejectedValue(new Error("DB error"));

    const body = {
      items: [mockItem],
      shippingAddress: "Test",
      shippingMethod: "pickup",
    };

    const res = await POST(new Request("http://localhost:3000/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBeDefined();
  });
});
