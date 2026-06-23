import { DataManager } from "@/components/admin/data-manager";

export default function AdminOriginsPage() {
  return (
    <div>
      <DataManager title="產地管理" apiPath="/api/origins" />
    </div>
  );
}
