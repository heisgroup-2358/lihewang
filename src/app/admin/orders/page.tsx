"use client";

import { useState } from "react";
import { Search, Package, Truck, MapPin, MessageCircle, ExternalLink, Check, X, Loader2 } from "lucide-react";

// Mock data — will be replaced with real API data
const ORDERS = [
  {
    id: "ORD-20250622-1024", customer: "陳大文", phone: "+85251112233", date: "2025-06-22",
    total: 1878, items: 3, status: "shipped", payment: "paid",
    shippingMethod: "順豐站自取", shippingAddress: "旺角富榮花園2期地下38號舖",
    trackingNumber: "SF1234567890",
    productList: "白之戀人 x2, 六花亭 x1, Royce x3",
  },
  {
    id: "ORD-20250615-0891", customer: "李小華", phone: "+85262223344", date: "2025-06-15",
    total: 458, items: 1, status: "pending", payment: "paid",
    shippingMethod: "上門送貨", shippingAddress: "銅鑼灣軒尼詩道500號15樓B室",
    trackingNumber: null,
    productList: "京都和菓子禮盒 x1",
  },
  {
    id: "ORD-20250610-0567", customer: "張美玲", phone: "+85273334455", date: "2025-06-10",
    total: 894, items: 3, status: "delivered", payment: "paid",
    shippingMethod: "順豐站自取", shippingAddress: "沙田新城市廣場3期2樓",
    trackingNumber: "SF0987654321",
    productList: "東京抹茶禮盒 x3",
  },
  {
    id: "ORD-20250601-0234", customer: "王小明", phone: "+85284445566", date: "2025-06-01",
    total: 1234, items: 4, status: "pending", payment: "unpaid",
    shippingMethod: "順豐站自取", shippingAddress: "荃灣南豐中心638室",
    trackingNumber: null,
    productList: "白之戀人 x2, Royce x2",
  },
];

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(ORDERS);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentStatus, setSentStatus] = useState<Record<string, boolean>>({});

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.includes(search)
  );

  const saveTracking = (id: string) => {
    if (!trackingInput.trim()) return;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, trackingNumber: trackingInput.trim(), status: "shipped" } : o));
    setEditingId(null);
    setTrackingInput("");
  };

  const sendWhatsApp = async (order: typeof ORDERS[0]) => {
    setSendingId(order.id);
    // Simulate sending — will call actual API later
    await new Promise((r) => setTimeout(r, 1500));
    setSentStatus((prev) => ({ ...prev, [order.id]: true }));
    setSendingId(null);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">訂單管理</h1>
      <p className="mt-1 text-sm text-muted-foreground">查看訂單、輸入運單號碼、發送 WhatsApp 通知</p>

      {/* Search */}
      <div className="relative mt-6 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋訂單編號或客戶..."
          className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                <th className="px-4 py-3.5 text-left font-medium text-muted-foreground">訂單 / 客戶</th>
                <th className="px-4 py-3.5 text-left font-medium text-muted-foreground hidden md:table-cell">商品</th>
                <th className="px-4 py-3.5 text-right font-medium text-muted-foreground">金額</th>
                <th className="px-4 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
                <th className="px-4 py-3.5 text-left font-medium text-muted-foreground min-w-[180px]">運單號碼</th>
                <th className="px-4 py-3.5 text-center font-medium text-muted-foreground">通知</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-medium">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.customer} · {o.date}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {o.shippingMethod}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-xs text-muted-foreground max-w-[200px] truncate" title={o.productList}>
                      {o.productList}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{o.items} 件商品</p>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    ${o.total.toLocaleString()}
                    <p className={`text-xs mt-0.5 ${o.payment === "paid" ? "text-green-600" : "text-amber-600"}`}>
                      {PAYMENT_LABELS[o.payment]}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {editingId === o.id ? (
                      <div className="flex items-center gap-1">
                        <input value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder="SF1234567890"
                          className="flex-1 rounded-full border border-border h-8 px-3 text-xs min-w-[120px]"
                          autoFocus />
                        <button onClick={() => saveTracking(o.id)}
                          className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {o.trackingNumber ? (
                          <>
                            <span className="text-xs font-medium text-primary">{o.trackingNumber}</span>
                            <a href={`https://htm.sf-express.com/hk/tc/dynamic_function/waybill/?wbNo=${o.trackingNumber}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-primary">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        <button onClick={() => { setEditingId(o.id); setTrackingInput(o.trackingNumber || ""); }}
                          className="text-xs text-primary hover:underline ml-1 shrink-0">
                          {o.trackingNumber ? "更改" : "輸入"}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {o.trackingNumber ? (
                      sentStatus[o.id] ? (
                        <div className="flex items-center justify-center gap-1 text-green-600">
                          <Check className="h-3.5 w-3.5" />
                          <span className="text-xs">已發送</span>
                        </div>
                      ) : (
                        <button onClick={() => sendWhatsApp(o)}
                          disabled={sendingId === o.id}
                          className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors px-3 py-1.5 text-xs font-medium">
                          {sendingId === o.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <MessageCircle className="h-3 w-3" />
                          )}
                          {sendingId === o.id ? "發送中..." : "WhatsApp"}
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">需先輸入運單</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">無符合訂單</p>
          </div>
        )}
      </div>
    </div>
  );
}
