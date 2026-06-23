# Lihewang Testing & Infrastructure Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add Vitest unit tests, Playwright E2E tests, error pages, CI/CD, config optimizations, and cleanup.

**Architecture:** Install Vitest + Playwright, mock Prisma for unit tests, run E2E against local dev server. Error pages follow Next.js App Router conventions. CI/CD runs on GitHub Actions. Config changes are additive.

**Tech Stack:** Vitest, Playwright, GitHub Actions, Next.js 16.2

## Global Constraints

- All new `.ts` files must pass `npm run lint` (0 errors)
- Tests must not require a running PostgreSQL database (mock Prisma)
- Playwright E2E tests require `npx playwright install chromium` after install
- `.env*` is gitignored — `.env.example` is the canonical reference
- `dev.db` must be deleted from git tracking and disk

---

### Task 1: Vitest + Playwright Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/lib/__tests__/setup.test.ts` (smoke test to verify infra works)
- Create: `tests/e2e/example.spec.ts` (smoke test)
- Modify: `package.json` (add test scripts)

**Interfaces:**
- Consumes: existing `tsconfig.json` paths config
- Produces: working `vitest` + `playwright` commands, `npm test`, `npm run test:e2e`

- [ ] **Step 1: Install dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create playwright.config.ts**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    cwd: ".",
  },
});
```

- [ ] **Step 4: Create smoke test for Vitest**

```ts
// src/lib/__tests__/setup.test.ts
import { describe, it, expect } from "vitest";

describe("test infrastructure", () => {
  it("vitest runs correctly", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Create smoke test for Playwright**

```ts
// tests/e2e/example.spec.ts
import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
});
```

- [ ] **Step 6: Add scripts to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"seed": "npx tsx prisma/seed.ts",
"db:migrate": "npx prisma migrate dev",
"db:studio": "npx prisma studio"
```

- [ ] **Step 7: Verify both smoke tests pass**

```bash
npm test
npx playwright test
```

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts playwright.config.ts src/lib/__tests__/ tests/e2e/ package.json
git commit -m "test: install Vitest + Playwright and add smoke tests"
```

---

### Task 2: Unit Tests — Data Service

**Files:**
- Create: `src/lib/__tests__/data-service.test.ts`

**Interfaces:**
- Consumes: `src/lib/data-service.ts` exports (`getFeaturedProducts`, `getAllProducts`, `getProductBySlug`, `getCategories`, `getRelatedProducts`)
- Produces: verified data service behavior with mocked Prisma

- [ ] **Step 1: Write the test file**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/generated/prisma/client", () => {
  const mockPrisma = {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

// Re-import after mocking
const { prisma } = await import("@/lib/prisma");
const dataService = await import("@/lib/data-service");

const mockProduct = {
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
  category: { id: "cat1", slug: "hokkaido", name: "北海道" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getFeaturedProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products sorted by rating descending", async () => {
    (prisma.product.findMany as any).mockResolvedValue([mockProduct]);
    const result = await dataService.getFeaturedProducts();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("ishiya-white-chocolate");
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { rating: "desc" },
      take: 6,
      include: { category: true },
    });
  });

  it("returns empty array on error (fallback)", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getFeaturedProducts();
    expect(result).toEqual([]);
  });
});

describe("getAllProducts", () => {
  it("returns all active products with categories", async () => {
    (prisma.product.findMany as any).mockResolvedValue([mockProduct]);
    const result = await dataService.getAllProducts();
    expect(result).toHaveLength(1);
  });

  it("returns empty array on error", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getAllProducts();
    expect(result).toEqual([]);
  });
});

describe("getProductBySlug", () => {
  it("returns product with category info", async () => {
    (prisma.product.findUnique as any).mockResolvedValue(mockProduct);
    const result = await dataService.getProductBySlug("ishiya-white-chocolate");
    expect(result?.slug).toBe("ishiya-white-chocolate");
  });

  it("returns null on error", async () => {
    (prisma.product.findUnique as any).mockRejectedValue(new Error("DB error"));
    const result = await dataService.getProductBySlug("anything");
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
```

- [ ] **Step 2: Run tests to verify**

```bash
npm test -- src/lib/__tests__/data-service.test.ts
```

Expected: all tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/data-service.test.ts
git commit -m "test: add unit tests for data-service.ts"
```

---

### Task 3: Unit Tests — API Routes

**Files:**
- Create: `src/app/api/__tests__/products.test.ts`
- Create: `src/app/api/__tests__/categories.test.ts`

**Interfaces:**
- Consumes: `src/app/api/products/route.ts`, `src/app/api/categories/route.ts`
- Produces: verified API route behavior

- [ ] **Step 1: Write products API test**

```ts
// src/app/api/__tests__/products.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/generated/prisma/client", () => {
  const mockPrisma = {
    product: { findMany: vi.fn() },
    category: { findUnique: vi.fn() },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

const { prisma } = await import("@/lib/prisma");
const { GET } = await import("../products/route");

describe("GET /api/products", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all active products", async () => {
    (prisma.product.findMany as any).mockResolvedValue([]);
    const req = new Request("http://localhost:3000/api/products");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("filters by category slug", async () => {
    (prisma.category.findUnique as any).mockResolvedValue({ id: "cat1" });
    (prisma.product.findMany as any).mockResolvedValue([]);
    const req = new Request("http://localhost:3000/api/products?category=hokkaido");
    const res = await GET(req);
    expect(res.status).toBe(200);
  });

  it("returns 200 on error with mock fallback", async () => {
    (prisma.product.findMany as any).mockRejectedValue(new Error("DB error"));
    const req = new Request("http://localhost:3000/api/products");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

- [ ] **Step 2: Verify products tests pass**

```bash
npm test -- src/app/api/__tests__/products.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/__tests__/products.test.ts
git commit -m "test: add unit tests for products API route"
```

---

### Task 4: Error Pages

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/loading.tsx`

- [ ] **Step 1: Create error.tsx**

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-6xl">😵</span>
      <h1 className="mb-2 font-heading text-2xl font-bold">唔好意思，發生錯誤</h1>
      <p className="mb-6 text-muted-foreground">
        我哋已經記錄咗呢個問題，請稍後再試。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        再試一次
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create not-found.tsx**

```tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-6xl">🔍</span>
      <h1 className="mb-2 font-heading text-2xl font-bold">搵唔到喎</h1>
      <p className="mb-6 text-muted-foreground">
        呢個頁面唔存在，或者已經被移除了。
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        返回首頁
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Create loading.tsx**

```tsx
export default function LoadingPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">載入中...</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build still passes**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/error.tsx src/app/not-found.tsx src/app/loading.tsx
git commit -m "feat: add error, not-found, and loading pages"
```

---

### Task 5: Package Scripts, .env.example, and Next Config

**Files:**
- Modify: `package.json` (scripts already added in Task 1)
- Create: `.env.example`
- Modify: `next.config.ts`

- [ ] **Step 1: Create .env.example**

```
# PostgreSQL connection string (required)
# Format: postgresql://user:password@host:port/database
DATABASE_URL="postgresql://user:password@localhost:5432/lihewang"

# Site URL (used for links and redirects)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 2: Update next.config.ts with optimizations**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add .env.example next.config.ts
git commit -m "chore: add .env.example and next.config optimizations"
```

---

### Task 6: CI/CD with GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

```yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: heisgroup
          POSTGRES_DB: lihewang
          POSTGRES_HOST_AUTH_METHOD: trust
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://heisgroup@localhost:5432/lihewang
      - run: npx tsx prisma/seed.ts
        env:
          DATABASE_URL: postgresql://heisgroup@localhost:5432/lihewang
      - run: npm test
      - run: npx playwright install chromium
      - run: npx playwright test
        env:
          DATABASE_URL: postgresql://heisgroup@localhost:5432/lihewang
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow with lint, build, test, and E2E"
```

---

### Task 7: Cleanup

**Files:**
- Delete: `dev.db`
- Delete: `dev.db` from git tracking if previously committed
- Modify: various `src/` files to fix lint unused-import warnings (23 warnings total)

- [ ] **Step 1: Remove dev.db**

```bash
rm dev.db
git rm --cached dev.db 2>/dev/null || true
```

- [ ] **Step 2: Fix all lint warnings**

Files with unused imports to fix:
- `src/app/account/commission/page.tsx` — remove `Copy`, `ExternalLink` imports
- `src/app/account/downline/page.tsx` — remove `ExternalLink`
- `src/app/account/orders/page.tsx` — remove `Badge`
- `src/app/account/page.tsx` — remove `Settings`, `Button`, `PRODUCTS`
- `src/app/admin/page.tsx` — remove `TrendingUp`
- `src/app/admin/users/page.tsx` — remove `STATUS_STYLES`
- `src/app/auth/register/page.tsx` — remove unused imports (`User`, `ShoppingBag`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `step`, `setStep`)
- `src/app/faq/page.tsx` — remove `Link`
- `src/app/products/[slug]/page.tsx` — remove `RefreshCw`
- `src/components/admin/admin-layout.tsx` — remove `LogOut`
- `src/components/layout/footer.tsx` — remove `NAV_LINKS`
- `src/components/shared/category-strip.tsx` — fix `i` unused in map
- `src/components/shared/hero-section.tsx` — remove `Button`

For each file, remove the unused import from the import line. For `category-strip.tsx`, either use `_i` or remove the unused index.

- [ ] **Step 3: Verify lint passes with 0 warnings**

```bash
npm run lint
```

Expected: no warnings or errors

- [ ] **Step 4: Verify build still passes**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dev.db, fix all lint warnings"
```

---

### Task 8: Playwright E2E Tests (Core Flows)

**Files:**
- Create: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/products.spec.ts`
- Create: `tests/e2e/cart.spec.ts`

- [ ] **Step 1: Home page E2E test**

```ts
// tests/e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test("home page loads with featured products", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("text=精選產品").first()).toBeVisible();
});

test("navigation links work", async ({ page }) => {
  await page.goto("/");
  await page.click("text=產品");
  await expect(page).toHaveURL(/\/products/);
});
```

- [ ] **Step 2: Products page E2E test**

```ts
// tests/e2e/products.spec.ts
import { test, expect } from "@playwright/test";

test("products page shows product list", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator("text=所有產品").first()).toBeVisible();
});

test("product detail page loads", async ({ page }) => {
  await page.goto("/products/ishiya-white-chocolate");
  await expect(page.locator("text=白之戀人").first()).toBeVisible();
});

test("product not found shows error state", async ({ page }) => {
  await page.goto("/products/nonexistent-product");
  await expect(page.locator("text=搵唔到").first()).toBeVisible();
});
```

- [ ] **Step 3: Cart flow E2E test**

```ts
// tests/e2e/cart.spec.ts
import { test, expect } from "@playwright/test";

test("cart page loads", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.locator("text=購物車").first()).toBeVisible();
});

test("checkout page loads", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.locator("text=結帳").first()).toBeVisible();
});
```

- [ ] **Step 4: Run E2E tests**

```bash
npx playwright test
```

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/home.spec.ts tests/e2e/products.spec.ts tests/e2e/cart.spec.ts
git commit -m "test: add Playwright E2E tests for core flows"
```
