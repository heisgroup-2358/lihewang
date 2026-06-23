# Lihewang — Testing Infrastructure & Project Hardening

Date: 2026-06-23

## Overview

Add unit/E2E testing, missing error pages, package scripts, environment documentation, CI/CD, config optimizations, and cleanup to the lihewang Next.js e-commerce project.

## 1. Test Infrastructure

### Vitest (Unit Tests)

- **Config**: `vitest.config.ts` with `@vitejs/plugin-react`, `jsdom` environment, `@/*` path alias from `tsconfig.json`
- **Location**: `src/lib/__tests__/*.test.ts`, `src/components/**/*.test.tsx`, co-located `*.test.ts` next to API routes
- **Mocking**: `vi.mock("@/generated/prisma/client")` for all Prisma-dependent tests
- **Coverage targets**:
  - `src/lib/data-service.ts` — fallback/mock logic
  - `src/app/api/*/route.ts` — each endpoint with success + error cases
  - `src/components/ui/*` — basic render tests for shadcn-style primitives

### Playwright (E2E Tests)

- **Config**: `playwright.config.ts`, `baseURL: "http://localhost:3000"`
- **Required**: `npx playwright install chromium`
- **Flows**:
  - Home page loads with featured products
  - Products listing renders with categories
  - Product detail page shows info + add-to-cart
  - Cart add/remove quantity
  - Auth login/register form validation
  - Admin dashboard navigation

## 2. Error Pages

```
src/app/error.tsx       — "error.tsx" with retry button, error message display
src/app/not-found.tsx   — "not-found.tsx" 404 page with link to home
src/app/loading.tsx     — "loading.tsx" global skeleton/spinner
```

## 3. Package.json Scripts

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "seed": "npx tsx prisma/seed.ts",
  "db:migrate": "npx prisma migrate dev",
  "db:studio": "npx prisma studio"
}
```

## 4. .env.example

```
DATABASE_URL="postgresql://user:password@localhost:5432/lihewang"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

With comments explaining each variable. `.env*` already in `.gitignore`.

## 5. CI/CD (GitHub Actions)

`.github/workflows/ci.yml`:
- Triggers: push/PR to `main`
- Steps: checkout → Node setup → `npm ci` → `npm run lint` → `npm run build` → `npm test` → `npx playwright test`

PostgreSQL service container for E2E tests.

## 6. Next Config Optimizations

- `images.remotePatterns` — allow external image domains
- `headers` — security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
- `redirects` — if needed (e.g., /product -> /products)
- `eslint.ignoreDuringBuilds: true` (already covered by lint step)

## 7. Cleanup

- Delete `dev.db` (SQLite leftover from earlier schema)
- Fix all `npm run lint` warnings (unused imports across 10+ files)

## Implementation Order

1. Vitest config + install
2. Write unit tests for lib/ and API routes
3. Playwright config + install
4. Write E2E tests
5. Error pages (error.tsx, not-found.tsx, loading.tsx)
6. Package.json scripts
7. .env.example
8. Next config optimizations
9. CI/CD (GitHub Actions)
10. Cleanup (dev.db, lint warnings)
11. Final build + lint verification and commit
