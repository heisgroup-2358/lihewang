"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold tracking-wide">
          訂閱優惠
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          搶先收到新貨通知、限定優惠與禮盒資訊
        </p>
        <form
          className="mx-auto mt-6 flex max-w-md gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="email"
            placeholder="你的電郵地址"
            className="flex-1 rounded-full border-border bg-background px-5"
          />
          <Button
            type="submit"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            訂閱
          </Button>
        </form>
      </div>
    </section>
  );
}
