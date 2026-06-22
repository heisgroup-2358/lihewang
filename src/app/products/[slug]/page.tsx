import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, RefreshCw, Shield, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shared/product-card";
import { getProductBySlug, getRelatedProducts } from "@/lib/data-service";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const details: string[] = JSON.parse(product.details);

  const categorySlug: string = "categorySlug" in product
    ? (product as { categorySlug?: string }).categorySlug ?? "snacks"
    : (product.category as { slug?: string })?.slug ?? "snacks";

  const related = await getRelatedProducts(slug, categorySlug);

  const categoryName: string = "categoryName" in product
    ? (product as { categoryName?: string }).categoryName ?? ""
    : (product.category as { name?: string })?.name ?? "";

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">首頁</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">產品</Link>
          <span className="mx-2">/</span>
          <Link href={`/products?category=${categorySlug}`} className="hover:text-foreground transition-colors">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/20">
              <span className="font-heading text-8xl text-muted-foreground/20">🎁</span>
            </div>
            {product.badge && (
              <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground text-sm px-4 py-1.5">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>·</span>
                <span>{product.origin}</span>
              </div>
              <h1 className="mt-2 font-heading text-3xl font-bold">{product.name}</h1>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} 則評價)
                </span>
              </div>
            </div>

            <Separator />

            <div className="rounded-xl bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground line-through">
                零售價 ${product.retailPrice}
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-heading text-3xl font-bold text-primary">
                  ${product.wholesalePriceL1}
                </span>
                <span className="text-sm text-muted-foreground">
                  批發價 (LV1)
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                LV2 批發價 ${product.wholesalePriceL2} · 登入後顯示
              </p>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div>
              <p className="mb-2 text-sm font-semibold">數量</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full" aria-label="減少">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">1</span>
                <Button variant="outline" size="icon" className="rounded-full" aria-label="增加">
                  <Plus className="h-4 w-4" />
                </Button>
                {product.stock === 0 && (
                  <Badge variant="outline" className="text-destructive border-destructive">
                    缺貨中
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="h-5 w-5" />
                加入購物車
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12" aria-label="收藏">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, text: "免運費" },
                  { icon: Shield, text: "日本正貨保證" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 rounded-xl border border-border/60 p-3">
                    <item.icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-xs font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border/60 p-3 text-xs text-muted-foreground leading-relaxed">
                食品及禮盒類產品不設退換，除非禮盒包裝嚴重損毀。
                紙盒包裝有機會於運輸過程中產生輕微壓傷或小裂縫，屬正常情況，不影響產品品質。
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-3">產品詳情</h3>
              <ul className="space-y-2">
                {details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <>
            <Separator className="my-16" />
            <div>
              <h2 className="mb-8 font-heading text-2xl font-bold text-center">
                你可能都鍾意
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p: any) => (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    brand={p.brand}
                    origin={p.origin}
                    price={p.retailPrice}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    badge={p.badge ?? undefined}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
