"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/use-cart";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const shipping = total >= 300 ? 0 : 30;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-wide">購物車</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex gap-4 rounded-xl border border-border/60 p-4 transition-colors hover:border-border"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary/30 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground/30">🎁</span>
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-heading font-medium hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <span className="font-heading font-bold text-lg">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="rounded-full"
                      aria-label="減少"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="rounded-full"
                      aria-label="增加"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="刪除"
                    onClick={() => removeItem(item.slug)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-24 rounded-xl border border-border/60 p-6">
            <h3 className="font-heading text-lg font-bold">訂單摘要</h3>

            <div className="mt-4 space-y-3">
              <Input
                placeholder="優惠碼"
                className="rounded-full border-border"
              />
              <Button variant="outline" size="sm" className="w-full rounded-full">
                套用
              </Button>
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
              <span>${(total + shipping).toLocaleString()}</span>
            </div>

            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 w-full rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center",
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              結帳
            </Link>

            <Link
              href="/products"
              className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              繼續購物
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
