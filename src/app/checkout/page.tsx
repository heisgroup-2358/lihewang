import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PRODUCTS } from "@/lib/mock-data";

const CART_ITEMS = PRODUCTS.slice(0, 3).map((p, i) => ({
  ...p,
  quantity: i === 0 ? 2 : i === 1 ? 1 : 3,
}));

export default function CheckoutPage() {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal >= 300 ? subtotal : subtotal + 30;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/cart" className="hover:text-foreground transition-colors">購物車</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">結帳</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="font-heading text-xl font-bold mb-4">送貨地址</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="收件人姓名" className="rounded-xl border-border" />
              <Input placeholder="聯絡電話" className="rounded-xl border-border" />
              <div className="sm:col-span-2">
                <Input placeholder="電郵地址" className="rounded-xl border-border" />
              </div>
              <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
                <option>香港島</option>
                <option>九龍</option>
                <option>新界</option>
              </select>
              <Input placeholder="詳細地址" className="rounded-xl border-border" />
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
                      defaultChecked={method.price === 0}
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
            <div className="rounded-xl border border-border/60 p-6 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-3 font-medium">Payme</p>
              <p className="mt-1 text-sm text-muted-foreground">
                結帳後將顯示 Payme QR Code 進行付款
              </p>
              <div className="mx-auto mt-4 h-48 w-48 rounded-xl bg-secondary/40 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Payme QR Code</span>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-border/60 p-6">
            <h3 className="font-heading text-lg font-bold">訂單摘要</h3>

            <div className="mt-4 space-y-3">
              {CART_ITEMS.map((item) => (
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
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">運費</span>
                <span>{subtotal >= 300 ? "免運費" : "$30"}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>總計</span>
              <span>${total.toLocaleString()}</span>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              確認訂單 — ${total.toLocaleString()}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              提交訂單即表示同意我們的服務條款及退換政策
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
