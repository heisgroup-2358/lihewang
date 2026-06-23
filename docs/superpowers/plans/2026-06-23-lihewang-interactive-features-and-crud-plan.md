# Interactive Features & API CRUD Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans. Steps use checkbox syntax.

**Goal:** Wire up cart/checkout with localStorage, add product filters, wire newsletter, add CRUD API endpoints.

**Architecture:** Cart uses localStorage with a small hook (`useCart`). Products page uses `useSearchParams` for URL-bound filters. API routes use existing Prisma patterns.

**Tech Stack:** Next.js 16.2, Prisma 7.8, TypeScript

## Global Constraints

- All API routes must have try/catch returning appropriate error responses
- Must pass `npm run build` + `npm run lint` (0 errors)
- Cart uses localStorage only (no auth required)
- Product filters bind to URL search params

---

### Task 1: API CRUD — Products + Categories

**Files:**
- Modify: `src/app/api/products/[slug]/route.ts` (add PATCH, DELETE)
- Modify: `src/app/api/products/route.ts` (add POST)
- Modify: `src/app/api/categories/route.ts` (add POST)
- Create: `src/app/api/categories/[id]/route.ts` (PATCH, DELETE)

**Interfaces:**
- Consumes: existing Prisma schema
- Produces: complete CRUD for products and categories

- [ ] **Step 1: Add PATCH + DELETE to products/[slug]/route.ts**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const product = await prisma.product.update({
      where: { slug },
      data: body,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await prisma.product.update({
      where: { slug },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Add POST to products/route.ts**

Add before the existing `export async function GET`:
```ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Add POST to categories/route.ts**

```ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await prisma.category.create({ data: body });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create categories/[id]/route.ts**

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await prisma.category.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${productCount} products` },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/products/ src/app/api/categories/
git commit -m "feat: add CRUD API endpoints for products and categories"
```

---

### Task 2: Cart with localStorage

**Files:**
- Create: `src/lib/use-cart.ts` (custom hook)
- Modify: `src/app/cart/page.tsx` (useCart instead of hardcoded CART_ITEMS)
- Modify: `src/app/products/[slug]/page.tsx` (Add to Cart button)

**Interfaces:**
- Produces: `useCart()` hook with `{items, addItem, removeItem, updateQuantity, clearCart, total}`
- Consumes: cart data from localStorage under key `lihewang-cart`

- [ ] **Step 1: Create use-cart hook**

```ts
"use client";

import { useState, useEffect, useCallback } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const STORAGE_KEY = "lihewang-cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getStoredCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount: items.length };
}
```

- [ ] **Step 2: Update cart page to use useCart**

Replace the top of `cart/page.tsx`:
- Add `"use client"` 
- Replace `CART_ITEMS` constant with `const { items, updateQuantity, removeItem, total, itemCount } = useCart()`
- Wire quantity +/- buttons to call `updateQuantity`
- Wire trash button to call `removeItem`

- [ ] **Step 3: Update product detail page to add "Add to Cart"**

In `products/[slug]/page.tsx`, add the "Add to Cart" button handler:
- Import `useCart` 
- On click, call `addItem({ slug: product.slug, name: product.name, price: product.retailPrice, quantity: 1 })`
- Show a brief "已加入購物車" alert/toast

- [ ] **Step 4: Commit**

```bash
git add src/lib/use-cart.ts src/app/cart/page.tsx src/app/products/\[slug\]/page.tsx
git commit -m "feat: add cart with localStorage"
```

---

### Task 3: Checkout Page

**Files:**
- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: Wire checkout page**

Add `"use client"`, use `useCart()` to read items. Replace hardcoded CART_ITEMS. Wire "Confirm Order" button:
```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress: `${address}, ${district}`,
        shippingMethod,
        paymentMethod: "payme",
        orderType: "retail",
      }),
    });
    const data = await res.json();
    if (res.ok) {
      clearCart();
      router.push(`/order/confirm/${data.id}`);
    } else {
      setError(data.error ?? "提交失敗");
    }
  } catch {
    setError("網絡錯誤，請稍後再試");
  } finally {
    setSubmitting(false);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/app/checkout/page.tsx
git commit -m "feat: wire checkout page with cart data and order submission"
```

---

### Task 4: Products Page Filters

**Files:**
- Modify: `src/app/products/page.tsx`

- [ ] **Step 1: Convert to client component with URL-bound filters**

Add `"use client"`, use `useSearchParams` + `useRouter`:
```ts
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);
  // ...
}
```

Search input calls `setSearch(e.target.value)` which debounces and updates URL. Category checkboxes call `updateParam("category", cat.slug)` or `updateParam("category", null)` to toggle. Reset button calls `router.push("/products")`.

Keep the existing server component data fetching approach — instead, make it a client component that fetches from `/api/products` with the search params.

- [ ] **Step 2: Commit**

```bash
git add src/app/products/page.tsx
git commit -m "feat: add URL-bound filters to products page"
```

---

### Task 5: Newsletter API

**Files:**
- Create: `src/app/api/newsletter/route.ts`
- Modify: `src/components/shared/newsletter.tsx` (wire form submit)

- [ ] **Step 1: Create newsletter API route**

```ts
import { NextResponse } from "next/server";

// Simple in-memory store (no DB model needed — use email list)
const subscribers: string[] = [];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Already subscribed" });
    }
    subscribers.push(email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Wire newsletter form**

```tsx
"use client";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-3">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="你的電郵地址"
        className="flex-1 rounded-full border-border bg-background px-5"
        required
      />
      <Button type="submit" disabled={status === "loading"} className="rounded-full">
        {status === "loading" ? "..." : "訂閱"}
      </Button>
      {status === "success" && <p className="text-sm text-green-600">已訂閱！</p>}
      {status === "error" && <p className="text-sm text-red-600">訂閱失敗，請稍後再試</p>}
    </form>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/newsletter/ src/components/shared/newsletter.tsx
git commit -m "feat: add newsletter subscription API and form"
```
