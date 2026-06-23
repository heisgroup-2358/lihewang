import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getBrands, getOrigins } from "@/lib/admin-data-service";

export default async function NewProductPage() {
  const [categories, brands, origins] = await Promise.all([
    getCategories(), getBrands(), getOrigins(),
  ]);
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">新增產品</h1>
      <p className="mt-1 text-sm text-muted-foreground">填寫以下資訊創建新產品</p>
      <div className="mt-6 max-w-2xl">
        <ProductForm categories={categories} brands={brands} origins={origins} />
      </div>
    </div>
  );
}
