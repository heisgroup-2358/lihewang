import { getAdminProducts } from "@/lib/admin-data-service";
import { ProductsTable } from "@/components/admin/products-table";

export default async function AdminProductsPage() {
  const ADMIN_PRODUCTS = await getAdminProducts();
  return <ProductsTable products={ADMIN_PRODUCTS} />;
}
