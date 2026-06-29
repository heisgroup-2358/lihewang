import { getAdminOrders } from "@/lib/admin-data-service";
import { AdminOrdersClient } from "@/components/admin/admin-orders-client";

export default async function AdminOrdersPage() {
  const ADMIN_ORDERS = await getAdminOrders();
  return <AdminOrdersClient orders={ADMIN_ORDERS} />;
}
