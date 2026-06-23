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
  const [cooldown, setCooldown] = useState(0);

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
    if (res.ok) {
      setStep("otp");
      startCooldown();
    } else {
      setError("發送驗證碼失敗");
    }
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

  const startCooldown = () => {
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
  }, []);

  const identifier = channel === "whatsapp" ? phone : email;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/40 to-background px-4 py-16">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="text-center">
          <Link href="/" className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-primary">
            禮盒王
          </Link>
        </div>

        <div className="mt-6 md:mt-8 rounded-2xl border border-border/60 bg-card p-6 md:p-8 lg:p-10 shadow-sm">
          {step === "input" ? (
            <>
              <div className="text-center">
                <h1 className="font-heading text-xl md:text-2xl font-bold">歡迎回來</h1>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                  Welcome Back · 禮盒王 · 日本直送禮品專家
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium">選擇驗證方式</p>
                <p className="text-xs text-muted-foreground">Verification Method</p>
              </div>

              <div className="mt-3 flex gap-2">
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

              <form onSubmit={sendOtp} className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium">
                    {channel === "whatsapp" ? "WhatsApp 號碼" : "電郵地址"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {channel === "whatsapp" ? "WhatsApp Number" : "Email Address"}
                  </p>
                  {channel === "whatsapp" ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+852 5111 1234"
                      className="mt-1.5 w-full rounded-full border border-border h-11 lg:h-12 px-5 text-sm lg:text-base"
                      required
                    />
                  ) : (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1.5 w-full rounded-full border border-border h-11 lg:h-12 px-5 text-sm lg:text-base"
                      required
                    />
                  )}
                </div>

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
                  className="w-full rounded-full bg-primary h-11 lg:h-12 text-sm lg:text-base text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  {loading ? "..." : "發送驗證碼 Send Code"}
                </button>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    ["256-bit SSL", "Encryption"],
                    ["Cloudflare", "Protected"],
                    ["Bot Defense", "Turnstile"],
                    ["OTP", "Verified"],
                  ].map(([line1, line2]) => (
                    <div
                      key={`${line1}-${line2}`}
                      className="flex flex-col items-center gap-0.5 rounded-lg border border-border/40 bg-secondary/20 px-1 py-1.5"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-green-500" />
                      <span className="text-[8px] lg:text-[9px] font-medium text-muted-foreground leading-tight text-center">
                        {line1}<br />{line2}
                      </span>
                    </div>
                  ))}
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="font-heading text-xl md:text-2xl font-bold">輸入驗證碼</h1>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                  Enter Verification Code
                </p>
              </div>

              <form onSubmit={verifyOtp} className="mt-6 space-y-4">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  驗證碼已透過 {channel === "whatsapp" ? "WhatsApp" : "電郵"} 發送至
                </p>
                <p className="text-center text-sm font-medium">{identifier}</p>
                <button
                  type="button"
                  onClick={() => setStep("input")}
                  className="mx-auto block text-xs text-primary hover:underline"
                >
                  更改 Change
                </button>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="輸入驗證碼 Enter Code"
                  className="mt-4 w-full rounded-full border border-border h-11 px-5 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary h-11 text-sm text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  {loading ? "..." : "驗證並登入 Verify"}
                </button>

                {cooldown > 0 ? (
                  <p className="text-center text-xs text-muted-foreground">
                    未收到驗證碼？重新發送 ({cooldown}s)
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setStep("input"); setCode(""); }}
                    className="mx-auto block text-xs text-primary hover:underline"
                  >
                    未收到驗證碼？重新發送 Resend
                  </button>
                )}

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
