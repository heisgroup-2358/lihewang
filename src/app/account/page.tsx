import Link from "next/link";
import {
  Package,
  Wallet,
  Users,
  User,
  ChevronRight,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RECENT_ORDERS = [
  { id: "ORD-20250622-1024", date: "2025-06-22", total: 1878, status: "已付款", items: 3 },
  { id: "ORD-20250615-0891", date: "2025-06-15", total: 458, status: "已發貨", items: 1 },
  { id: "ORD-20250610-0567", date: "2025-06-10", total: 894, status: "已完成", items: 2 },
];

const STATUS_COLORS: Record<string, string> = {
  "已付款": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "已發貨": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "已完成": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="font-heading text-2xl text-primary">陳</span>
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">陳先生 您好</h1>
          <p className="text-sm text-muted-foreground">
            批發會員 LV1 · 會員編號: WH-00123
          </p>
        </div>
        <Badge className="ml-auto bg-primary/10 text-primary border-0">
          批發會員
        </Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { icon: Package, label: "訂單記錄", value: "12", href: "/account/orders" },
          { icon: Wallet, label: "佣金錢包", value: "$2,340", href: "/account/commission" },
          { icon: Users, label: "下線客戶", value: "4", href: "/account/downline" },
          { icon: User, label: "個人資料", value: "管理", href: "/account/profile" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 rounded-xl border border-border/60 p-5 transition-colors hover:border-border hover:shadow-sm"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-heading text-lg font-bold">{item.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border/60">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <h2 className="font-heading text-lg font-bold">最近訂單</h2>
          <Link
            href="/account/orders"
            className="text-sm text-primary hover:underline"
          >
            查看全部
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/20"
            >
              <div className="flex items-center gap-4">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.date} · {order.items} 件商品
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold">
                  ${order.total.toLocaleString()}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
