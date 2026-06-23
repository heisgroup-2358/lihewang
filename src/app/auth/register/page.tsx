"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (res.ok) setStep("otp");
    else setError("發送驗證碼失敗");
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, name, referralCode: referralCode || undefined }),
    });
    if (res.ok) router.push("/account");
    else setError("驗證失敗");
    setLoading(false);
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-heading text-2xl font-bold">註冊</h1>
        <p className="mt-2 text-sm text-muted-foreground">建立帳戶，享受會員優惠</p>

        {step === "form" ? (
          <form onSubmit={sendOtp} className="mt-8 space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="姓名"
              className="w-full rounded-full border border-border h-12 px-5" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+852 5111 1234"
              className="w-full rounded-full border border-border h-12 px-5" required />
            <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="推薦碼（可選）"
              className="w-full rounded-full border border-border h-12 px-5" />
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-primary h-12 text-primary-foreground font-medium">
              {loading ? "..." : "註冊"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">驗證碼已發送到 {phone}</p>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
              placeholder="輸入驗證碼"
              className="w-full rounded-full border border-border h-12 px-5 text-center text-lg tracking-widest" required />
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-primary h-12 text-primary-foreground font-medium">
              {loading ? "..." : "驗證"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
