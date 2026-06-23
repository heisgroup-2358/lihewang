"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";

interface Product {
  slug: string;
  name: string;
  brand: string;
  origin: string;
  retailPrice: number;
  wholesalePriceL1: number;
  wholesalePriceL2: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
}

const CATEGORIES = [
  { slug: "hokkaido", name: "北海道" },
  { slug: "tokyo", name: "東京" },
  { slug: "kyoto", name: "京都" },
  { slug: "seasonal", name: "季節限定" },
  { slug: "snacks", name: "零食" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/products?${params.toString()}`);
    },
    [searchParams, router],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");

    const controller = new AbortController();

    startTransition(async () => {
      try {
        const res = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setProducts(data);
      } catch {}
    });

    return () => controller.abort();
  }, [debouncedSearch, searchParams, startTransition]);

  const activeCategory = searchParams.get("category");
  const loading = isPending && products.length === 0;

  return (
    <>
      <div className="bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              首頁
            </Link>
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
                  <Input
                    placeholder="搜尋..."
                    className="pl-9 rounded-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">分類</h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat.slug}
                      className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border accent-primary"
                        checked={activeCategory === cat.slug}
                        onChange={(e) => {
                          updateParam(
                            "category",
                            e.target.checked ? cat.slug : null,
                          );
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full"
                onClick={() => router.push("/products")}
              >
                重設篩選
              </Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                共{" "}
                <span className="font-medium text-foreground">
                  {products.length}
                </span>{" "}
                件產品
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-lg bg-secondary/50"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-muted-foreground">無符合條件的產品</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => router.push("/products")}
                >
                  重設篩選
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    slug={product.slug}
                    name={product.name}
                    brand={product.brand}
                    origin={product.origin}
                    price={product.retailPrice}
                    wholesalePrice={product.wholesalePriceL1}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    badge={product.badge ?? undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
