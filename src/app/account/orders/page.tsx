"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const ORDERS = [
  {
    id: "ORD-20250622-1024", date: "2025-06-22", total: 1878, status: "shipped",
    payment: "paid", paymentMethod: "FPS", shippingMethod: "順豐站自取",
    shippingAddress: "旺角富榮花園2期地下38號舖\n陳大文\n+852 5111 2233",
    trackingNumber: "SF1234567890",
    items: [
      { name: "白之戀人 12件入", qty: 2, price: 580, productCode: "ISH-0001" },
      { name: "六花亭草莓朱古力", qty: 1, price: 320, productCode: "ROY-0003" },
      { name: "Royce 朱古力薯片", qty: 3, price: 398, productCode: "ROY-0005" },
    ],
  },
  {
    id: "ORD-20250615-0891", date: "2025-06-15", total: 458, status: "pending",
    payment: "unpaid", paymentMethod: "Alipay", shippingMethod: "上門送貨",
    shippingAddress: "香港銅鑼灣軒尼詩道500號15樓B室\n李小華\n+852 6222 3344",
    trackingNumber: null,
    items: [
      { name: "京都和菓子禮盒", qty: 1, price: 458, productCode: "KYO-0002" },
    ],
  },
  {
    id: "ORD-20250610-0567", date: "2025-06-10", total: 894, status: "delivered",
    payment: "paid", paymentMethod: "八達通", shippingMethod: "順豐站自取",
    shippingAddress: "沙田新城市廣場3期2樓\n張美玲\n+852 7333 4455",
    trackingNumber: "SF0987654321",
    items: [
      { name: "東京抹茶禮盒", qty: 3, price: 298, productCode: "TKY-0001" },
    ],
  },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "待處理", color: "bg-amber-100 text-amber-700" },
  shipped: { label: "已發貨", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "已完成", color: "bg-green-100 text-green-700" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-700" },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  FPS: "FPS 轉數快", Alipay: "Alipay 支付寶", WeChat: "WeChat Pay",
  八達通: "八達通", PayMe: "PayMe",
};

function OrderCard({ order }: { order: typeof ORDERS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100" };
  const isShipped = order.status === "shipped" || order.status === "delivered";

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Header - collapsed view */}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-5 hover:bg-secondary/10 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{order.id}</p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}</p>
            <p className="font-heading text-lg font-bold">${order.total.toLocaleString()}</p>
            <span className={`inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Product summary */}
        <div className="mt-3 flex flex-wrap gap-2">
          {order.items.map((item) => (
            <span key={item.name} className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
              {item.name} x{item.qty}
            </span>
          ))}
        </div>

        {/* Tracking number in collapsed view (if shipped) */}
        {isShipped && order.trackingNumber && (
          <div className="flex items-center justify-between mt-3">
            <span />
            <a href={`https://htm.sf-express.com/hk/tc/dynamic_function/waybill/?wbNo=${order.trackingNumber}`}
              target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
              <Truck className="h-3 w-3" />
              運單：{order.trackingNumber}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* Expand indicator */}
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
          {expanded ? <><ChevronUp className="h-3 w-3 mr-1" /> 收起詳情</> : <><ChevronDown className="h-3 w-3 mr-1" /> 查看詳情</>}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border/60 divide-y divide-border/40">
          {/* Items detail */}
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">商品明細</p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground"> x{item.qty}</span>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.productCode}</p>
                  </div>
                  <span className="text-sm font-medium">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-sm font-bold">總計</span>
                <span className="font-heading font-bold">${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> 送貨資料
            </p>
            <p className="text-sm whitespace-pre-line">{order.shippingAddress}</p>
            <p className="text-xs text-muted-foreground mt-1">配送方式：{order.shippingMethod}</p>
          </div>

          {/* Tracking */}
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <Truck className="h-3 w-3" /> 運送追蹤
            </p>
            {order.trackingNumber ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">運單號碼：{order.trackingNumber}</span>
                <a href={`https://htm.sf-express.com/hk/tc/dynamic_function/waybill/?wbNo=${order.trackingNumber}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5">
                  追蹤 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">尚未發貨</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? ORDERS : ORDERS.filter((o) => o.status !== "delivered");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        返回會員中心
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">訂單記錄</h1>
        {ORDERS.some((o) => o.status === "delivered") && (
          <button onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:underline">
            {showAll ? "只顯示進行中" : "顯示全部訂單"}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">暫無訂單記錄</p>
            <Link href="/products" className="mt-2 inline-block text-sm text-primary hover:underline">
              去購物
            </Link>
          </div>
        ) : (
          displayed.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
