"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [step, setStep] = useState<"input" | "otp">("input");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
            禮盒王
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold">登入</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            使用 WhatsApp 或電郵驗證登入，無需密碼
          </p>
        </div>

        <div className="mt-8">
          {step === "input" ? (
            <>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="w-full rounded-full bg-secondary p-1">
                  <TabsTrigger value="whatsapp" className="flex-1 rounded-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex-1 rounded-full gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Mail className="h-4 w-4" />
                    電郵
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="whatsapp" className="mt-6">
                  <Input
                    placeholder="+852 5111 1234"
                    className="rounded-full border-border h-12 text-center text-lg"
                  />
                  <p className="mt-2 text-xs text-muted-foreground text-center">
                    輸入已註冊的 WhatsApp 號碼
                  </p>
                </TabsContent>

                <TabsContent value="email" className="mt-6">
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    className="rounded-full border-border h-12 text-center text-lg"
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-4 flex justify-center">
                <div className="h-16 w-40 rounded-lg bg-secondary/40 flex items-center justify-center text-xs text-muted-foreground">
                  Cloudflare Turnstile
                </div>
              </div>

              <Button
                className="mt-6 w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => setStep("otp")}
              >
                發送驗證碼
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                驗證碼已發送至 <span className="font-medium text-foreground">+852 5111 1234</span>
              </p>

              <div className="mt-6 flex justify-center gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    className="h-12 w-10 rounded-lg border border-border bg-background text-center text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                有效期 120 秒 · <span className="text-primary font-medium">59s</span>
              </p>

              <Button
                variant="link"
                size="sm"
                className="mt-2 text-muted-foreground"
              >
                重新發送
              </Button>

              <Button className="mt-6 w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                登入
              </Button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          尚未有帳戶？{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  );
}
