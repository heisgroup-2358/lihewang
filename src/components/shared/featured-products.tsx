import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

const FEATURED_PRODUCTS = [
  {
    slug: "ishiya-white-chocolate",
    name: "白之戀人 24件入",
    brand: "Ishiya",
    origin: "北海道",
    price: 388,
    rating: 4.8,
    reviewCount: 32,
    badge: "人氣",
  },
  {
    slug: "tokyo-matcha-gift",
    name: "東京抹茶禮盒",
    brand: "京都宇治",
    origin: "東京",
    price: 298,
    rating: 4.6,
    reviewCount: 28,
    badge: "新上市",
  },
  {
    slug: "kyoto-wagashi",
    name: "京都和菓子禮盒",
    brand: "虎屋",
    origin: "京都",
    price: 458,
    rating: 4.7,
    reviewCount: 18,
  },
] as const;

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>精選禮品</SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard
              key={product.slug}
              {...product}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full gap-2 inline-flex items-center",
            )}
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
