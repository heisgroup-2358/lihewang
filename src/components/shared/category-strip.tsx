import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "./category-card";

export function CategoryStrip() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold tracking-wide sm:text-3xl">
            探索產地
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-primary" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              slug={cat.slug}
              name={cat.name}
              image={cat.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
