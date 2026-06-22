import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getFeaturedProducts } from "@/lib/data-service";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>精選產品</SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
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

        {products.length > 3 && (
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
        )}
      </div>
    </section>
  );
}
