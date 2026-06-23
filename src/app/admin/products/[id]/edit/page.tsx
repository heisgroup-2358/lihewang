import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProduct, getBrands, getOrigins } from "@/lib/admin-data-service";
import { getCategories } from "@/lib/data-service";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands, origins] = await Promise.all([
    getProduct(id),
    getCategories(),
    getBrands(),
    getOrigins(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">編輯產品</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-6 max-w-2xl">
        <ProductForm categories={categories} brands={brands} origins={origins} product={product} />
      </div>
    </div>
  );
}
