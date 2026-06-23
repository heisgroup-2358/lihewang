import { DataManager } from "@/components/admin/data-manager";

export default function AdminCategoriesPage() {
  return (
    <div>
      <DataManager title="分類管理" apiPath="/api/categories" />
    </div>
  );
}
