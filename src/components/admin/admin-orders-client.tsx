"use client";

import { useState } from "react";
import { Search, Package, Truck, MapPin, MessageCircle, ExternalLink, Check, X, Loader2 } from "lucide-react";

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  items: number;
  status: string;
  payment: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-0",
  shipped: "bg-blue-100 text-blue-700 border-0",
  delivered: "bg-green-100 text-green-700 border-0",
  cancelled: "bg-red-100 text-red-700 border-0",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "待處理", shipped: "已發貨", delivered: "已完成", cancelled: "已取消",
};
const PAYMENT_LABELS: Record<string, string> = {
  paid: "已付款", unpaid: "未付款", refunded: "已退款",
};

export function AdminOrdersClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.includes(search)
  );

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">訂單管理</h1>
      <p className="mt-1 text-sm text-muted-foreground">查看及管理所有訂單</p>

      <div className="relative mt-6 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋訂單編號或客戶..."
          className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">訂單編號</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">客戶</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">日期</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">金額</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground hidden md:table-cell">商品</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">付款</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4 font-medium">{o.id}</td>
                <td className="px-5 py-4">{o.customer}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{o.date}</td>
                <td className="px-5 py-4 text-right font-medium">${o.total}</td>
                <td className="px-5 py-4 text-center hidden md:table-cell text-xs text-muted-foreground">{o.items} 件</td>
                <td className="px-5 py-4 text-center">
                  <span className={`text-xs font-medium ${o.payment === "paid" ? "text-green-600" : o.payment === "refunded" ? "text-red-600" : "text-amber-600"}`}>
                    {PAYMENT_LABELS[o.payment]}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">暫無訂單</p>
          </div>
        )}
      </div>
    </div>
  );
}
