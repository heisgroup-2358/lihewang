import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  slug: string;
  name: string;
  image?: string;
  className?: string;
}

export function CategoryCard({
  slug,
  name,
  image,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className={cn(
        "group relative flex aspect-[4/3] items-end overflow-hidden rounded-xl bg-secondary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      {image ? (
        <div className="absolute inset-0 bg-secondary/50 transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 to-secondary/20 transition-transform duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="relative z-10 w-full p-5 transition-transform duration-500 group-hover:translate-y-[-2px]">
        <h3 className="font-heading text-lg font-bold text-white">
          {name}
        </h3>
        <p className="mt-1 text-sm text-white/80 transition-all duration-300 group-hover:ml-1">
          探索更多 →
        </p>
      </div>
    </Link>
  );
}
