import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import { getAllProducts, getCategories } from "@/lib/data-service";
import type { DbProduct } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <>
      <div className="bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">產品</span>
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-wide sm:text-4xl">
            所有產品
          </h1>
          <p className="mt-2 text-muted-foreground">
            從日本各地搜羅的頂級禮盒與零食
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="搜尋..." className="pl-9 rounded-full" />
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">分類</h4>
                <div className="space-y-2">
                  {categories.map((cat: { slug: string; name: string }) => (
                    <label
                      key={cat.slug}
                      className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full rounded-full">
                重設篩選
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                共 <span className="font-medium text-foreground">{products.length}</span> 件產品
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product: DbProduct) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  origin={product.origin}
                  price={product.retailPrice}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  badge={product.badge ?? undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
