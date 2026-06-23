import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ORDERS = [
  { id: "ORD-20250622-1024", date: "2025-06-22", total: 1878, status: "已付款", items: [{ name: "白之戀人", qty: 2 }, { name: "六花亭", qty: 1 }, { name: "Royce", qty: 3 }] },
  { id: "ORD-20250615-0891", date: "2025-06-15", total: 458, status: "已發貨", items: [{ name: "京都和菓子禮盒", qty: 1 }] },
  { id: "ORD-20250610-0567", date: "2025-06-10", total: 894, status: "已完成", items: [{ name: "東京抹茶禮盒", qty: 3 }] },
  { id: "ORD-20250601-0234", date: "2025-06-01", total: 1234, status: "已完成", items: [{ name: "白之戀人", qty: 2 }, { name: "Royce", qty: 2 }] },
];

const STATUS_STYLES: Record<string, string> = {
  "已付款": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "已發貨": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "已完成": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回會員中心
      </Link>

      <h1 className="font-heading text-2xl font-bold">訂單記錄</h1>

      <div className="mt-6 space-y-4">
        {ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border/60 p-6 transition-colors hover:border-border hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-heading text-lg font-bold">${order.total.toLocaleString()}</p>
                <span className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.items.map((item) => (
                <span key={item.name} className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
                  {item.name} x{item.qty}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
