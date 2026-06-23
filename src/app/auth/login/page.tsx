"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TurnstileWidget } from "@/components/shared/turnstile";

export default function LoginPage() {
  const router = useRouter();
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("請完成驗證");
      return;
    }
    setLoading(true);
    setError("");
    const body = channel === "whatsapp"
      ? { channel, phone, captchaToken }
      : { channel, email, captchaToken };
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
      ? { channel, phone, code }
      : { channel, email, code };
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) router.push("/account");
    else setError("驗證碼錯誤");
    setLoading(false);
  };

  const onCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
            禮盒王
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h1 className="text-center font-heading text-xl font-bold">登入</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {step === "input" ? "選擇驗證方式" : "輸入驗證碼"}
          </p>

          {step === "input" && (
            <div className="mt-5 flex gap-2">
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

          {step === "input" ? (
            <form onSubmit={sendOtp} className="mt-5 space-y-4">
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

              <div className="flex justify-center">
                <TurnstileWidget onVerify={onCaptchaVerify} />
              </div>

              {channel === "whatsapp" && (
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                  繼續即表示您同意接收 WhatsApp 驗證訊息。
                  <br />
                  By continuing, you agree to receive WhatsApp verification messages.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary h-12 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                {loading ? "..." : "發送驗證碼"}
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  "256-bit SSL Encryption",
                  "Cloudflare Protected",
                  "Bot Defense Turnstile",
                  "OTP Verified",
                ].map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-secondary/20 px-2.5 py-2"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="mt-5 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
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
                onClick={() => setStep("input")}
                className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                返回
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
