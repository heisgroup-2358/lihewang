"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const [step, setStep] = useState<"input" | "otp">("input");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
            禮盒王
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold">註冊</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            成為會員，享受會員優惠及批發服務
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Input placeholder="姓名" className="rounded-full border-border h-12" />
          <Input placeholder="+852 5111 1234" className="rounded-full border-border h-12" />
          <Input type="email" placeholder="電郵地址（可選）" className="rounded-full border-border h-12" />

          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm font-medium">有推薦人？</p>
            <Input
              placeholder="輸入推薦碼（可選）"
              className="mt-2 rounded-full border-border"
            />
          </div>

          <Button className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            註冊
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          已有帳戶？{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            立即登入
          </Link>
        </p>
      </div>
    </div>
  );
}
