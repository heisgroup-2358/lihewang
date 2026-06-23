import { prisma } from "./prisma";
import {
  ADMIN_STATS,
  ADMIN_PRODUCTS,
  ADMIN_ORDERS,
  ADMIN_USERS,
  WHOLESALE_APPLICATIONS,
  COMMISSION_REPORT,
  WITHDRAWAL_REQUESTS,
} from "./admin-mock-data";

export async function getAdminStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalUsers,
      wholesaleUsers,
      pendingApplications,
      pendingWithdrawals,
      revenueAgg,
      monthlyAgg,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: { not: "cart" } } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: { in: ["wholesale_lv1", "wholesale_lv2"] } } }),
      prisma.wholesaleApplication.count({ where: { status: "pending" } }),
      prisma.withdrawalRequest.count({ where: { status: "pending" } }),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "cart" } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: startOfMonth }, status: { not: "cart" } },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalUsers,
      wholesaleUsers,
      pendingApplications,
      pendingWithdrawals,
      totalRevenue: revenueAgg._sum.totalAmount ?? 0,
      monthlyRevenue: monthlyAgg._sum.totalAmount ?? 0,
      totalCommissionPaid: 0,
    };
  } catch {
    return ADMIN_STATS;
  }
}

export async function getAdminProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.retailPrice,
      stock: p.stock,
      status: p.isActive ? "active" as const : "inactive" as const,
      sales: p.reviewCount,
    }));
  } catch {
    return ADMIN_PRODUCTS;
  }
}

export async function getProduct(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

export async function getAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { not: "cart" } },
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return orders.map((o) => ({
      id: o.id,
      customer: o.user?.name ?? o.user?.phone ?? "未知",
      date: o.createdAt.toISOString().split("T")[0],
      total: o.totalAmount,
      items: o.items.length,
      status: o.status,
      payment: o.paymentStatus,
    }));
  } catch {
    return ADMIN_ORDERS;
  }
}

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return users.map((u) => ({
      id: u.id,
      name: u.name ?? u.phone,
      email: u.email ?? "",
      phone: u.phone,
      role: u.role,
      status: "active" as const,
      orders: 0,
      joined: u.createdAt.toISOString().split("T")[0],
    }));
  } catch {
    return ADMIN_USERS;
  }
}

export async function getWholesaleApplications() {
  try {
    const apps = await prisma.wholesaleApplication.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return apps.map((a) => ({
      id: a.id,
      company: a.companyName,
      contact: a.contactName,
      phone: a.phone,
      email: a.email,
      date: a.createdAt.toISOString().split("T")[0],
      status: a.status,
    }));
  } catch {
    return WHOLESALE_APPLICATIONS;
  }
}

export async function getCommissionTransactions() {
  try {
    const txns = await prisma.commissionTransaction.findMany({
      include: { upline: true },
      orderBy: { createdAt: "desc" },
    });
    const grouped = new Map<string, { user: string; downlines: Set<string>; orders: number; commission: number; paid: number; pending: number }>();
    for (const t of txns) {
      const key = t.uplineId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          user: t.upline.name ?? t.upline.phone,
          downlines: new Set(),
          orders: 0,
          commission: 0,
          paid: 0,
          pending: 0,
        });
      }
      const g = grouped.get(key)!;
      g.downlines.add(t.downlineId);
      g.orders += 1;
      g.commission += t.amount;
      if (t.status === "paid") g.paid += t.amount;
      else g.pending += t.amount;
    }
    return Array.from(grouped.values()).map((g) => ({
      user: g.user,
      downlines: g.downlines.size,
      orders: g.orders,
      commission: g.commission,
      paid: g.paid,
      pending: g.pending,
    }));
  } catch {
    return COMMISSION_REPORT;
  }
}

export async function getWithdrawalRequests() {
  try {
    const reqs = await prisma.withdrawalRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    return reqs.map((r) => ({
      id: r.id,
      user: r.user?.name ?? r.user?.phone ?? "未知",
      amount: r.amount,
      bank: r.bankName,
      account: r.bankAccountNo,
      date: r.createdAt.toISOString().split("T")[0],
      status: r.status,
    }));
  } catch {
    return WITHDRAWAL_REQUESTS;
  }
}
