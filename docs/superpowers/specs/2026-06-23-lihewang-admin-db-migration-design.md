# Lihewang — Admin Panel Database Migration

Date: 2026-06-23

## Overview

Replace all hardcoded mock data in the 6 admin pages with real Prisma database queries via a dedicated admin data service layer.

## Architecture

Create `src/lib/admin-data-service.ts` — one function per admin page, each returning typed data. Pages become async server components that fetch data at render time. Mock data from `admin-mock-data.ts` is preserved as error fallbacks.

## Admin Data Service (`src/lib/admin-data-service.ts`)

Exported functions:

- `getAdminStats()` — aggregated counts + revenue for dashboard
- `getAdminProducts()` — all products with category and sales data
- `getAdminOrders()` — all orders with user and items
- `getAdminUsers()` — all users with order counts
- `getWholesaleApplications()` — applications with user info
- `getCommissionTransactions()` — transactions with upline/downline
- `getWithdrawalRequests()` — withdrawal requests with user

Each function:
1. Queries Prisma directly
2. Maps results to match the shape expected by existing page components
3. Has try/catch that falls back to the existing mock data on DB error

## Page Changes

| Page | File | Change |
|---|---|---|
| Dashboard | `src/app/admin/page.tsx` | Make async, call `getAdminStats()`, remove `ADMIN_STATS` import |
| Products | `src/app/admin/products/page.tsx` | Make async, call `getAdminProducts()`, remove `ADMIN_PRODUCTS` |
| Orders | `src/app/admin/orders/page.tsx` | Make async, call `getAdminOrders()`, remove `ADMIN_ORDERS` |
| Users | `src/app/admin/users/page.tsx` | Make async, call `getAdminUsers()` + `getWholesaleApplications()` |
| Withdrawals | `src/app/admin/withdrawals/page.tsx` | Make async, call `getWithdrawalRequests()` |
| Commission | `src/app/admin/commission/page.tsx` | Make async, call `getCommissionTransactions()` |

UI components remain unchanged — only the data source changes.

## Testing

- Unit tests for `admin-data-service.ts` using the same Prisma mock pattern as `data-service.test.ts`
- Verify each function returns correct shape matching what pages expect

## Implementation Order

1. Create `src/lib/admin-data-service.ts` with all 7 functions
2. Update each admin page to use the service
3. Run build + lint + test to verify
4. Commit
