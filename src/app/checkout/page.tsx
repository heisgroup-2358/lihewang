"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/use-cart";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("香港島");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [shippingMethod, setShippingMethod] = useState("順豐站自取");
  const [paymentMethod, setPaymentMethod] = useState("Fps");
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; label: string; name: string; phone: string; district: string; detail: string }[]>([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  useEffect(() => {
    fetch("/api/addresses").then((r) => r.json()).then(setSavedAddresses).catch(() => {});
  }, []);

  const PAYMENT_METHODS = [
    { id: "Fps", label: "FPS 轉數快", icon: "💳" },
    { id: "Alipay", label: "Alipay 支付寶", icon: "💳" },
    { id: "Wechat", label: "WeChat Pay 微信支付", icon: "💳" },
    { id: "Octopus", label: "八達通", icon: "🐙" },
    { id: "PayMe", label: "PayMe", icon: "💳" },
  ];

  const shipping = total >= 300 ? 0 : 30;
  const grandTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          shippingAddress: `${name}, ${phone}, ${email}, ${district}, ${address}`,
          shippingMethod,
          paymentMethod,
          orderType: "retail",
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error ?? "提交失敗");
        setSubmitting(false);
        return;
      }

      // 2. Create PaymentAsia payment
      const paymentRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          network: paymentMethod,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        setError(paymentData.error ?? "創建付款失敗");
        setSubmitting(false);
        return;
      }

      // 3. Clear cart and redirect to PaymentAsia
      clearCart();
      window.location.href = paymentData.payment_url;
    } catch {
      setError("網絡錯誤，請稍後再試");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold">購物車是空的</h1>
        <p className="mt-2 text-muted-foreground">請先加入商品再結帳</p>
        <Link href="/products">
          <Button className="mt-6 rounded-full">去購物</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/cart" className="hover:text-foreground transition-colors">購物車</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">結帳</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm mb-4">
              <input type="checkbox" checked={useSavedAddress} onChange={(e) => setUseSavedAddress(e.target.checked)} />
              使用已儲存地址
            </label>

            {useSavedAddress && savedAddresses.length > 0 && (
              <select value="" onChange={(e) => {
                const addr = savedAddresses.find((a) => a.id === e.target.value);
                if (addr) {
                  setName(addr.name);
                  setPhone(addr.phone);
                  setDistrict(addr.district);
                  setAddress(addr.detail);
                }
              }}
              className="w-full rounded-full border border-border h-11 px-5 text-sm bg-background">
                <option value="">選擇地址</option>
                {savedAddresses.map((a: Record<string, string>) => (
                  <option key={a.id} value={a.id}>{a.label} — {a.detail}</option>
                ))}
              </select>
            )}
          </div>

          <section>
            <h2 className="font-heading text-xl font-bold mb-4">送貨地址</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="收件人姓名"
                className="rounded-xl border-border"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="聯絡電話"
                className="rounded-xl border-border"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  placeholder="電郵地址"
                  className="rounded-xl border-border"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <select
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option>香港島</option>
                <option>九龍</option>
                <option>新界</option>
              </select>
              <Input
                placeholder="詳細地址"
                className="rounded-xl border-border"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-heading text-xl font-bold mb-4">送貨方式</h2>
            <div className="space-y-3">
              {[
                { label: "順豐站自取", price: 0, time: "2-3 個工作天" },
                { label: "送貨上門", price: 30, time: "1-2 個工作天" },
              ].map((method) => (
                <label
                  key={method.label}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-4 transition-colors hover:border-primary has-checked:border-primary has-checked:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.label}
                      defaultChecked={method.label === shippingMethod}
                      onChange={() => setShippingMethod(method.label)}
                      className="h-4 w-4 accent-primary"
                    />
                    <div>
                      <span className="text-sm font-medium">{method.label}</span>
                      <p className="text-xs text-muted-foreground">{method.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {method.price === 0 ? "免費" : `$${method.price}`}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-heading text-xl font-bold mb-4">付款方式</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-border/60 p-4 transition-colors hover:border-primary has-checked:border-primary has-checked:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value={m.id} defaultChecked={m.id === paymentMethod}
                      onChange={() => setPaymentMethod(m.id)} className="h-4 w-4 accent-primary" />
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-border/60 p-6">
            <h3 className="font-heading text-lg font-bold">訂單摘要</h3>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary/30 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground/30">🎁</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">小計</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">運費</span>
                <span>{shipping === 0 ? "免運費" : `$${shipping}`}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>總計</span>
              <span>${grandTotal.toLocaleString()}</span>
            </div>

            {error && (
              <p className="mt-3 text-center text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />處理中...</>
              ) : (
                `確認訂單 — $${grandTotal.toLocaleString()}`
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              提交訂單即表示同意我們的服務條款及退換政策
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
