import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { PRODUCTS } from "@/lib/mock-data";

const CATEGORIES = ["全部", "北海道", "東京", "京都", "季節限定"];
const PRICE_RANGES = ["$200以下", "$200-$300", "$300-$400", "$400-$500", "$500以上"];

export default function ProductsPage() {
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
            從日本各地搜羅的頂級禮盒，為你傳遞最真摯的心意
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
                  <Input placeholder="搜尋禮盒..." className="pl-9 rounded-full" />
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">分類</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={cat === "全部"}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">價格範圍</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range}
                      className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      {range}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">產地</h4>
                <div className="space-y-2">
                  {["北海道", "東京", "京都"].map((region) => (
                    <label
                      key={region}
                      className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      {region}
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
                共 <span className="font-medium text-foreground">{PRODUCTS.length}</span> 件產品
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground lg:hidden" />
                <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
                  <option>人氣推薦</option>
                  <option>價格：低至高</option>
                  <option>價格：高至低</option>
                  <option>最新上架</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  origin={product.origin}
                  price={product.price}
                  wholesalePrice={product.wholesalePriceL1}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  badge={product.badge}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
