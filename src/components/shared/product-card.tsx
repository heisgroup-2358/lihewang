import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  origin: string;
  price: number;
  wholesalePrice?: number;
  rating: number;
  reviewCount: number;
  image?: string;
  badge?: string;
  className?: string;
}

export function ProductCard({
  slug,
  name,
  brand,
  origin,
  price,
  wholesalePrice,
  rating,
  reviewCount,
  image,
  badge,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        {image ? (
          <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground transition-transform duration-700 group-hover:scale-105">
            <span className="text-xs">{brand}</span>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/30 transition-transform duration-700 group-hover:scale-105">
            <span className="text-4xl text-muted-foreground/30">🎁</span>
          </div>
        )}
        {badge && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
            {badge}
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{brand}</span>
          <span>·</span>
          <span>{origin}</span>
        </div>

        <h3 className="font-heading text-base font-medium leading-snug">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </div>

        <div className="mt-auto pt-2">
          {wholesalePrice ? (
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-bold text-primary">
                ${wholesalePrice.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="font-heading text-lg font-bold">
              ${price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
