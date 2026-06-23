"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = channel === "whatsapp" ? { channel, phone } : { channel, email };
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) setStep("otp");
    else setError("發送驗證碼失敗");
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = channel === "whatsapp"
      ? { channel, phone, code, name, referralCode: referralCode || undefined }
      : { channel, email, code, name, phone: phone || undefined, referralCode: referralCode || undefined };
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) router.push("/account");
    else setError("驗證失敗");
    setLoading(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
            禮盒王
          </Link>
          <h1 className="mt-6 font-heading text-2xl font-bold">註冊</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "form" ? "建立帳戶，享受會員優惠" : "輸入驗證碼"}
          </p>
        </div>

        {step === "form" && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setChannel("whatsapp")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${
                channel === "whatsapp"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setChannel("email")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${
                channel === "email"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              電郵
            </button>
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={sendOtp} className="mt-8 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="姓名"
              className="w-full rounded-full border border-border h-12 px-5"
            />
            {channel === "whatsapp" ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+852 5111 1234"
                className="w-full rounded-full border border-border h-12 px-5"
                required
              />
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-full border border-border h-12 px-5"
                required
              />
            )}
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="推薦碼（可選）"
              className="w-full rounded-full border border-border h-12 px-5"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary h-12 text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              {loading ? "..." : "註冊"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              驗證碼已發送到 {channel === "whatsapp" ? phone : email}
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="輸入驗證碼"
              className="w-full rounded-full border border-border h-12 px-5 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary h-12 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              {loading ? "..." : "驗證"}
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              返回
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        )}

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
