# Lihewang — Admin Product Management

Date: 2026-06-23

## Overview

Add image upload, product create/edit pages, CSV template download, and CSV bulk upload to the admin panel.

## Image Upload

- Supabase Storage bucket `products` (public)
- `POST /api/upload` — accepts multipart file, uploads to Supabase, returns public URL
- Image preview in form before save

## Product Form Pages

- `src/app/admin/products/new/page.tsx` — create form
- `src/app/admin/products/[id]/edit/page.tsx` — edit form (reuses same form component)

Fields: name, slug, brand, origin, categoryId (select), description, details, retailPrice, wholesalePriceL1, wholesalePriceL2, costPrice, stock, badge, images (upload + URL input)

## CSV Template + Bulk Upload

- `GET /api/products/template` — returns CSV file with headers + example row
- `POST /api/products/bulk` — accepts CSV file (multipart), creates products, returns results

CSV columns: name, slug, brand, origin, categorySlug, description, retailPrice, wholesalePriceL1, wholesalePriceL2, costPrice, stock, badge, imageUrl

## Admin Products Page Updates

- Add "新增產品" button → `/admin/products/new`
- Add "下載模板" button → download CSV
- Add "匯入CSV" button → modal with file upload
- Each row: Edit/Delete buttons

## Implementation Order

1. Create `POST /api/upload` for image upload
2. Create CSV template + bulk upload API routes
3. Create product form component (shared between new/edit)
4. Create `/admin/products/new` page
5. Create `/admin/products/[id]/edit` page
6. Update `/admin/products` table with action buttons
7. Build + lint + test + commit
