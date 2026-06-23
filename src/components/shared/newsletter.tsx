"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-bold tracking-wide">
          訂閱優惠
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          搶先收到新貨通知、限定優惠與禮盒資訊
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="你的電郵地址"
            className="flex-1 rounded-full border-border bg-background px-5"
            required
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {status === "loading" ? "..." : "訂閱"}
          </Button>
        </form>
        {status === "success" && <p className="mt-2 text-sm text-green-600">已訂閱！</p>}
        {status === "error" && <p className="mt-2 text-sm text-red-600">訂閱失敗，請稍後再試</p>}
      </div>
    </section>
  );
}
