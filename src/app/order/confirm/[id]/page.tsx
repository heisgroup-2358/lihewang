import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function OrderConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 font-heading text-3xl font-bold">訂單已確認！</h1>
        <p className="mt-3 text-muted-foreground">
          感謝你的訂購，我們會盡快為你安排發貨。
        </p>

        <div className="mx-auto mt-8 inline-block rounded-xl border border-border/60 bg-secondary/20 px-8 py-4">
          <p className="text-xs text-muted-foreground">訂單編號</p>
          <p className="font-heading text-lg font-bold tracking-wide">{id}</p>
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>📧 訂單確認電郵已發送到你的郵箱</p>
          <p>📦 發貨後會以 WhatsApp 通知配送編號</p>
          <p>💳 如未付款，請於 24 小時內完成 Payme 付款</p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className={cn(
              buttonVariants(),
              "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 min-w-[180px] inline-flex items-center justify-center",
            )}
          >
            查看訂單
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full min-w-[180px] inline-flex items-center justify-center",
            )}
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
