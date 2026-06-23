# Admin Product Management Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans.

**Goal:** Add image upload, product create/edit pages, CSV template download, and CSV bulk upload to the admin panel.

**Architecture:** File upload to Supabase Storage via `@supabase/supabase-js`. CSV parsing via `csv-parse`/`csv-stringify`. Product form as a shared client component.

**Tech Stack:** Next.js 16.2, Supabase Storage, CSV, Prisma 7.8

## Global Constraints

- Must pass `npm run build` + `npm run lint` (0 errors)
- Images stored in Supabase Storage bucket `products` (public)
- CSV columns: name, slug, brand, origin, categorySlug, description, retailPrice, wholesalePriceL1, wholesalePriceL2, costPrice, stock, badge, imageUrl

---

### Task 1: Upload API + CSV API

**Files:**
- Create: `src/lib/supabase.ts` (Supabase client)
- Create: `src/app/api/upload/route.ts`
- Create: `src/app/api/products/template/route.ts`
- Create: `src/app/api/products/bulk/route.ts`

- [ ] **Step 1: Create Supabase client**

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 2: Create upload API route**

```ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create CSV template route**

```ts
import { NextResponse } from "next/server";

export async function GET() {
  const headers = "name,slug,brand,origin,categorySlug,description,retailPrice,wholesalePriceL1,wholesalePriceL2,costPrice,stock,badge,imageUrl\n";
  const example = "白之戀人 24件入,ishiya-white-chocolate,石屋製菓 Ishiya,北海道,hokkaido,來自北海道的經典手信,388,298,268,200,50,人氣熱賣,https://example.com/image.jpg\n";
  const bom = "\uFEFF"; // For Excel UTF-8 support
  const csv = bom + headers + example;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=products-template.csv",
    },
  });
}
```

- [ ] **Step 4: Create bulk upload route**

Parse CSV, create products, return results.

```ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const [headerLine, ...dataLines] = lines;
    const headers = headerLine.split(",").map((h) => h.trim());

    const results = { success: 0, errors: [] as string[] };

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(",").map((v) => v.trim());
        const row = Object.fromEntries(headers.map((h, j) => [h, values[j]]));

        const cat = await prisma.category.findUnique({ where: { slug: row.categorySlug } });
        if (!cat) { results.errors.push(`Row ${i + 2}: category not found`); continue; }

        await prisma.product.create({
          data: {
            name: row.name, slug: row.slug, brand: row.brand, origin: row.origin,
            categoryId: cat.id, description: row.description,
            retailPrice: parseFloat(row.retailPrice), wholesalePriceL1: parseFloat(row.wholesalePriceL1),
            wholesalePriceL2: parseFloat(row.wholesalePriceL2), costPrice: parseFloat(row.costPrice),
            stock: parseInt(row.stock) || 0, badge: row.badge || null,
            images: row.imageUrl ? JSON.stringify([row.imageUrl]) : "[]",
          },
        });
        results.success++;
      } catch (e: any) {
        results.errors.push(`Row ${i + 2}: ${e.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

- [ ] **Step 5: Install deps + commit**

```bash
npm install @supabase/supabase-js
git add src/lib/supabase.ts src/app/api/upload/ src/app/api/products/template/ src/app/api/products/bulk/
git commit -m "feat: add upload API, CSV template, and bulk upload"
```

---

### Task 2: Product Form + New/Edit Pages

**Files:**
- Create: `src/components/admin/product-form.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/edit/page.tsx`

- [ ] **Step 1: Create product form component**

A client component with all form fields: name, slug (auto-generated from name), brand, origin, category select, description, details, prices, stock, badge, image upload with preview.

- [ ] **Step 2: Create new product page**

```tsx
import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/admin-data-service";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">新增產品</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create edit product page**

Fetch existing product by ID, pass to ProductForm for editing. Include `PATCH /api/products/[slug]` for saving changes.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/product-form.tsx src/app/admin/products/new/ src/app/admin/products/\[id\]/
git commit -m "feat: add product create and edit pages"
```

---

### Task 3: Update Admin Products List

**Files:**
- Modify: `src/app/admin/products/page.tsx`

- [ ] **Step 1: Add action buttons and CSV controls**

Replace the static table with controls:
- "新增產品" button → link to `/admin/products/new`
- "下載模板" button → download from `/api/products/template.csv`
- "匯入CSV" button → opens a modal/input for file upload → POST to `/api/products/bulk`
- Each row: edit link (pencil icon) and delete button (trash icon) → calls DELETE API

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/products/page.tsx
git commit -m "feat: add action buttons and CSV controls to products list"
```
