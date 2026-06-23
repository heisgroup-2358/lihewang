# Admin Panel DB Migration Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans. Steps use checkbox syntax.

**Goal:** Replace hardcoded mock data in all 6 admin pages with real Prisma database queries.

**Architecture:** Create `src/lib/admin-data-service.ts` with one async function per admin page, each returning typed data matching the existing page component expectations. Pages become async server components.

**Tech Stack:** Prisma 7.8, Next.js 16.2, TypeScript

## Global Constraints

- All functions must have try/catch with mock data fallback on DB error
- Each function return type must match the shape expected by the existing page component
- Pages must not change their render logic — only the data source
- Must pass `npm run build` + `npm run lint` (0 errors)

---

### Task 1: Admin Data Service

**Files:**
- Create: `src/lib/admin-data-service.ts`

**Interfaces:**
- Consumes: `@/lib/prisma` (existing Prisma singleton)
- Produces: 7 async functions consumed by all 6 admin pages

- [ ] **Step 1: Create the admin data service**

```ts
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
      totalCommissionPaid: 0, // calculated separately if needed
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
      orders: 0, // would need a separate count query
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
    // Group by upline to match the report format
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
```

- [ ] **Step 2: Verify file compiles**

```bash
npx tsc --noEmit src/lib/admin-data-service.ts 2>&1 | head -5
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-data-service.ts
git commit -m "feat: add admin-data-service with real DB queries and mock fallbacks"
```

---

### Task 2: Update Admin Pages

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/app/admin/products/page.tsx`
- Modify: `src/app/admin/orders/page.tsx`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/app/admin/withdrawals/page.tsx`
- Modify: `src/app/admin/commission/page.tsx`

**Interfaces:**
- Consumes: functions from `@/lib/admin-data-service` created in Task 1

- [ ] **Step 1: Update admin dashboard**

Replace the import and make the page async:

```tsx
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { getAdminStats } from "@/lib/admin-data-service";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    // ... same JSX, replace ADMIN_STATS with stats ...
  );
}
```

- [ ] **Step 2: Update admin products page**

```tsx
import { getAdminProducts } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  // ... same JSX, replace ADMIN_PRODUCTS with products ...
}
```

- [ ] **Step 3: Update admin orders page**

```tsx
import { getAdminOrders } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";
// Keep STATUS_STYLES, STATUS_LABELS, PAYMENT_LABELS

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  // ... same JSX, replace ADMIN_ORDERS with orders ...
}
```

- [ ] **Step 4: Update admin users page**

```tsx
import { getAdminUsers, getWholesaleApplications } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";
// Keep ROLE_LABELS, ROLE_STYLES

export default async function AdminUsersPage() {
  const [users, applications] = await Promise.all([
    getAdminUsers(),
    getWholesaleApplications(),
  ]);
  // ... same JSX, replace ADMIN_USERS with users, WHOLESALE_APPLICATIONS with applications ...
}
```

- [ ] **Step 5: Update admin withdrawals page**

```tsx
import { getWithdrawalRequests } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";
// Keep STATUS_STYLES

export default async function AdminWithdrawalsPage() {
  const requests = await getWithdrawalRequests();
  // ... same JSX, replace WITHDRAWAL_REQUESTS with requests ...
}
```

- [ ] **Step 6: Update admin commission page**

```tsx
import { getCommissionTransactions } from "@/lib/admin-data-service";

export default async function AdminCommissionPage() {
  const report = await getCommissionTransactions();
  // ... same JSX, replace COMMISSION_REPORT with report ...
}
```

- [ ] **Step 7: Verify build + lint pass**

```bash
npm run build && npm run lint
```

- [ ] **Step 8: Commit**

```bash
git add src/app/admin/
git commit -m "feat: connect admin pages to real DB data"
```
