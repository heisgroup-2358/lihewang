import { DataManager } from "@/components/admin/data-manager";

export default function AdminBrandsPage() {
  return (
    <div>
      <DataManager title="品牌管理" apiPath="/api/brands" />
    </div>
  );
}
