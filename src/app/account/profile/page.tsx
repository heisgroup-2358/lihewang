"use client";

import { useState, useEffect } from "react";
import { BadgeCheck, Pencil, X, Loader2 } from "lucide-react";

type Profile = {
  lastName: string | null;
  firstName: string | null;
  phone: string;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  birthday: string | null;
  addresses: Address[];
};

type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  district: string;
  detail: string;
  sfCode: string | null;
  sfName: string | null;
  isDefault: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [verifyModal, setVerifyModal] = useState<"phone" | "email" | null>(null);
  const [newValue, setNewValue] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [verifyError, setVerifyError] = useState("");
  const [verifySaving, setVerifySaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then((d) => {
      setProfile(d);
      setLastName(d.lastName || "");
      setFirstName(d.firstName || "");
      setBirthday(d.birthday ? d.birthday.slice(0, 10) : "");
      setLoading(false);
    });
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastName, firstName, birthday: birthday || null }),
    });
    setSaving(false);
  };

  const sendOtp = async () => {
    setVerifyError("");
    setVerifySaving(true);
    const endpoint = verifyModal === "phone" ? "/api/profile/verify-phone" : "/api/profile/verify-email";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyModal === "phone" ? { phone: newValue } : { email: newValue }),
    });
    const data = await res.json();
    setVerifySaving(false);
    if (!res.ok) { setVerifyError(data.error || "Failed to send OTP"); return; }
    setOtpToken(data.otpToken);
    setStep("otp");
  };

  const verifyOtp = async () => {
    setVerifyError("");
    setVerifySaving(true);
    const endpoint = verifyModal === "phone" ? "/api/profile/verify-phone" : "/api/profile/verify-email";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(verifyModal === "phone" ? { phone: newValue } : { email: newValue }), code: otpCode, otpToken }),
    });
    const data = await res.json();
    setVerifySaving(false);
    if (!res.ok) { setVerifyError(data.error || "Invalid code"); return; }
    setProfile((prev) => prev ? { ...prev, [verifyModal!]: newValue, [`${verifyModal}Verified`]: true } : prev);
    setVerifyModal(null);
    setStep("input");
    setNewValue("");
    setOtpCode("");
    setOtpToken("");
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">載入中...</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-bold mb-8">個人資料</h1>

      {/* Section 1: Basic Info */}
      <section className="rounded-xl border border-border/60 p-6 mb-6">
        <h2 className="font-heading text-lg font-bold mb-4">基本資料</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">姓</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-full border border-border h-10 px-4 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">名</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-full border border-border h-10 px-4 text-sm" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground mb-1">生日</label>
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
            className="w-full rounded-full border border-border h-10 px-4 text-sm" />
        </div>
        <button onClick={saveProfile} disabled={saving}
          className="rounded-full bg-primary px-6 h-10 text-sm text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "儲存"}
        </button>
      </section>

      {/* Section 2: Security */}
      <section className="rounded-xl border border-border/60 p-6 mb-6">
        <h2 className="font-heading text-lg font-bold mb-4">安全設定</h2>
        {[["phone", "電話", profile.phone], ["email", "電郵", profile.email || ""]].map(([key, label, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
            <div className="flex items-center gap-3">
              {((key === "phone" && profile.phoneVerified) || (key === "email" && profile.emailVerified)) && (
                <BadgeCheck className="h-5 w-5 text-green-500" />
              )}
              <button onClick={() => { setVerifyModal(key as "phone" | "email"); setStep("input"); setNewValue(value); }}
                className="text-xs text-primary hover:underline flex items-center gap-1">
                <Pencil className="h-3 w-3" /> 更改
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Section 3: Addresses */}
      <section className="rounded-xl border border-border/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold">地址管理</h2>
          <button onClick={() => window.location.href = "/account/profile/addresses/new"}
            className="text-xs text-primary hover:underline">+ 新增地址</button>
        </div>
        {profile.addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">尚未儲存地址</p>
        ) : (
          <div className="space-y-3">
            {profile.addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between rounded-lg border border-border/40 p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-medium">{addr.label}</span>
                    {addr.isDefault && <span className="text-xs text-primary">預設</span>}
                  </div>
                  <p className="text-sm">{addr.detail}</p>
                  <p className="text-xs text-muted-foreground">{addr.name} · {addr.phone}</p>
                  {addr.sfCode && <p className="text-xs text-muted-foreground">點碼: {addr.sfCode}</p>}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => window.location.href = `/account/profile/addresses/${addr.id}`}
                      className="text-xs text-primary hover:underline">編輯</button>
                    <button onClick={async () => {
                      if (confirm("確定刪除？")) {
                        await fetch(`/api/addresses/${addr.id}`, { method: "DELETE" });
                        window.location.reload();
                      }
                    }} className="text-xs text-red-500 hover:underline">刪除</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Verify Modal */}
      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold">更改{verifyModal === "phone" ? "電話" : "電郵"}</h3>
              <button onClick={() => { setVerifyModal(null); setStep("input"); }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "input" ? (
              <>
                <input value={newValue} onChange={(e) => setNewValue(e.target.value)}
                  placeholder={verifyModal === "phone" ? "+852 51234567" : "your@email.com"}
                  className="w-full rounded-full border border-border h-10 px-4 text-sm mb-4" />
                {verifyError && <p className="text-red-500 text-xs mb-2">{verifyError}</p>}
                <button onClick={sendOtp} disabled={verifySaving}
                  className="w-full rounded-full bg-primary h-10 text-sm text-primary-foreground font-medium hover:bg-primary/90">
                  {verifySaving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "發送驗證碼"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">驗證碼已發送到 {newValue}</p>
                <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="輸入驗證碼" maxLength={6}
                  className="w-full rounded-full border border-border h-10 px-4 text-sm mb-4 text-center text-lg tracking-widest" />
                {verifyError && <p className="text-red-500 text-xs mb-2">{verifyError}</p>}
                <button onClick={verifyOtp} disabled={verifySaving || otpCode.length < 6}
                  className="w-full rounded-full bg-primary h-10 text-sm text-primary-foreground font-medium hover:bg-primary/90">
                  {verifySaving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "驗證"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
