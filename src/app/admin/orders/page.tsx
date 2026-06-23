import { getAdminOrders } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-0",
  shipped: "bg-blue-100 text-blue-700 border-0",
  delivered: "bg-green-100 text-green-700 border-0",
  cancelled: "bg-red-100 text-red-700 border-0",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "待處理",
  shipped: "已發貨",
  delivered: "已完成",
  cancelled: "已取消",
};

const PAYMENT_LABELS: Record<string, string> = {
  paid: "已付款",
  unpaid: "未付款",
  refunded: "已退款",
};

export default async function AdminOrdersPage() {
  const ADMIN_ORDERS = await getAdminOrders();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">訂單管理</h1>
      <p className="mt-1 text-sm text-muted-foreground">查看及管理所有訂單</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">訂單編號</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">客戶</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">日期</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">金額</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">付款</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {ADMIN_ORDERS.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4 font-medium">{o.id}</td>
                <td className="px-5 py-4">{o.customer}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{o.date}</td>
                <td className="px-5 py-4 text-right font-medium">${o.total}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-xs font-medium ${o.payment === "paid" ? "text-green-600" : o.payment === "refunded" ? "text-red-600" : "text-amber-600"}`}>
                    {PAYMENT_LABELS[o.payment]}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <Badge className={STATUS_STYLES[o.status]}>
                    {STATUS_LABELS[o.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
