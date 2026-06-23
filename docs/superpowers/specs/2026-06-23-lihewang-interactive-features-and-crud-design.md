# Lihewang — Interactive Features & API CRUD

Date: 2026-06-23

## Overview

Make cart/checkout functional with localStorage, add client-side filtering on products page, wire up newsletter form, and add missing CRUD endpoints for products and categories.

## Part 1: Cart with localStorage

- Cart page (`src/app/cart/page.tsx`): `"use client"`, read/write localStorage array of `{slug, quantity}`. Quantity +/- and remove buttons update localStorage. Checkout button in cart navigates to `/checkout`.
- Checkout page (`src/app/checkout/page.tsx`): `"use client"`, read localStorage, show summary, shipping form submits to `POST /api/orders`. On success, clear localStorage and redirect to `/order/confirm/[id]`.
- Product detail page (`src/app/products/[slug]/page.tsx`): "Add to Cart" button calls `addToCart(slug)` which saves to localStorage.

## Part 2: Products Page Filters

- Convert to `"use client"` component
- Use `useSearchParams` + `useRouter` for URL-bound filters
- Search input with 300ms debounce
- Category checkboxes toggle URL params
- Page fetches data server-side based on URL params
- Reset button clears all params

## Part 3: Newsletter API

- `POST /api/newsletter` route — save email to DB
- Seed model if needed (simple email table)

## Part 4: API CRUD

New routes:
- `PATCH /api/products/[slug]` — update product fields
- `DELETE /api/products/[slug]` — soft delete (set isActive=false)
- `POST /api/products` — admin create product
- `POST /api/categories` — create category
- `PATCH /api/categories` — update category (need new route param)
- `DELETE /api/categories` — delete category (with products check)

## Implementation Order

1. API CRUD routes (products + categories)
2. Cart localStorage hook + cart page
3. Checkout page with order submission
4. Products page filters
5. Newsletter API
6. Build + lint + test + commit
