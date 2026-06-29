# Profile Management & SF Express Station Picker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal profile page (`/account/profile`) with name (split into last/first), birthday, changeable/verifiable phone/email, saved addresses (including SF Express pickup stations), and integrate saved addresses into checkout.

**Architecture:** New Prisma User fields + Address model; static JSON dataset for SF Express stations (~800 HK points); new API routes under `/api/profile`, `/api/addresses`, `/api/sf-stations`; client components for profile page, address modal, and reusable SF station picker.

**Tech Stack:** Next.js 16, Prisma 7, Resend (email OTP), Twilio (WhatsApp OTP), jose (JWT session)

## Global Constraints

- All new client components must be `"use client"`
- API routes use existing JWT session middleware (already protects `/api/orders`, `/api/cart`, etc.)
- SF Express station data stored in `src/data/sf-stations.json`, not DB
- Name split rule: first space = boundary, part before = lastName, part after = firstName. No space → firstName only
- Address labels: "屋企", "公司", "順豐站", "其他"
- All user-facing text in Traditional Chinese
- OTP verification reuses existing Twilio/Resend infrastructure from `src/lib/auth.ts`

---

### Task 1: Schema + Migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/XXX_add_profile_addresses/`

**Interfaces:**
- Consumes: existing User model
- Produces: User with lastName, firstName, birthday, phoneVerified, emailVerified; new Address model

- [ ] **Step 1: Update Prisma schema**

Add to User model:
```prisma
model User {
  // existing fields...
  lastName      String?
  firstName     String?
  birthday      DateTime?
  phoneVerified Boolean   @default(false)
  emailVerified Boolean   @default(false)
  addresses     Address[]
}
```

Add new model:
```prisma
model Address {
  id        String   @id @default(cuid())
  userId    String
  label     String   // "屋企" / "公司" / "順豐站" / "其他"
  name      String   // recipient name
  phone     String   // recipient phone
  district  String   // "香港島" / "九龍" / "新界" / "離島"
  detail    String   // full address
  sfCode    String?  // SF station code e.g. "852TAL"
  sfName    String?  // SF station name
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add_profile_addresses
```

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add profile fields and Address model"
```

---

### Task 2: SF Express Station Data

**Files:**
- Create: `src/data/sf-stations.json`

**Interfaces:**
- Produces: JSON file with `{ stations: [{ code, name, district, area, address }] }` — consumed by `/api/sf-stations`

- [ ] **Step 1: Create SF Express station JSON**

Create `src/data/sf-stations.json` with format:
```json
{
  "stations": [
    { "code": "852TAL", "name": "香港仔富嘉工廈順豐站", "district": "香港島", "area": "香港仔", "address": "香港仔大道234號富嘉工業大廈9樓6室" },
    { "code": "852BAL", "name": "旺角富榮花園順豐站", "district": "九龍", "area": "旺角", "address": "海泓道富榮花園2期地下38號舖" },
    { "code": "852GLPM", "name": "旺角家樂坊順豐站", "district": "九龍", "area": "旺角", "address": "登打士街56號家樂坊16樓1626室" },
    { "code": "852FDL", "name": "馬鞍山新港城中心順豐站", "district": "新界", "area": "馬鞍山", "address": "馬鞍山新港城中心大街地下G-3/68B號舖" },
    { "code": "852GDL", "name": "荃灣南豐中心順豐站", "district": "新界", "area": "荃灣", "address": "西樓角路64-98號南豐中心638-639室" }
  ]
}
```

Include at least ~100 major stations across all districts.

- [ ] **Step 2: Commit**

```bash
git add src/data/sf-stations.json
git commit -m "feat: add SF Express station dataset"
```

---

### Task 3: Profile API (GET/PATCH)

**Files:**
- Create: `src/app/api/profile/route.ts`

**Interfaces:**
- Consumes: existing JWT session via `getSession()` from `@/lib/auth`
- Produces: GET returns user profile with addresses; PATCH updates lastName, firstName, birthday

- [ ] **Step 1: Create profile API route**

```typescript
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { addresses: { orderBy: { createdAt: "desc" } } },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    lastName: user.lastName,
    firstName: user.firstName,
    phone: user.phone,
    email: user.email,
    phoneVerified: user.phoneVerified,
    emailVerified: user.emailVerified,
    birthday: user.birthday,
    addresses: user.addresses,
  });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lastName, firstName, birthday } = await req.json();

  const data: Record<string, unknown> = {};
  if (lastName !== undefined) data.lastName = lastName;
  if (firstName !== undefined) data.firstName = firstName;
  if (birthday !== undefined) data.birthday = birthday ? new Date(birthday) : null;

  const user = await prisma.user.update({
    where: { id: session.userId },
    data,
  });

  return NextResponse.json({ success: true, user: { lastName: user.lastName, firstName: user.firstName, birthday: user.birthday } });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/profile/route.ts
git commit -m "feat: add profile GET/PATCH API"
```

---

### Task 4: Phone/Email Verification API

**Files:**
- Create: `src/app/api/profile/verify-phone/route.ts`
- Create: `src/app/api/profile/verify-email/route.ts`

**Interfaces:**
- Consumes: `createOtpToken()`, `verifyOtpToken()` from `@/lib/auth`
- Produces: POST with new phone/email → sends OTP → second POST with code → verifies + updates user

- [ ] **Step 1: Create verify-phone route**

```typescript
import { NextResponse } from "next/server";
import { getSession, createOtpToken, verifyOtpToken, getTwilioClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone, code, otpToken } = await req.json();

  // Step 1: Send OTP (no code yet)
  if (!code) {
    if (!phone || !/^\+?[1-9]\d{6,14}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = await createOtpToken(phone, otpCode);

    const client = getTwilioClient();
    if (client) {
      await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({ to: phone, channel: "whatsapp" });
    }

    return NextResponse.json({ success: true, otpToken: token });
  }

  // Step 2: Verify code
  if (!otpToken || !(await verifyOtpToken(otpToken, phone, code))) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { phone, phoneVerified: true },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Create verify-email route**

```typescript
import { NextResponse } from "next/server";
import { getSession, createOtpToken, verifyOtpToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, code, otpToken } = await req.json();

  if (!code) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = await createOtpToken(email, otpCode);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@kyowagroup.com.hk",
      to: email,
      subject: "驗證您的電郵地址",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
        <h2 style="color:#d97706;">禮盒王 Lihewang</h2>
        <p>您的驗證碼是：</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#fef3c7;border-radius:8px;margin:16px 0;">${otpCode}</div>
        <p style="color:#6b7280;font-size:14px;">此驗證碼將於10分鐘後失效。</p>
      </div>`,
    });

    return NextResponse.json({ success: true, otpToken: token });
  }

  if (!otpToken || !(await verifyOtpToken(otpToken, email, code))) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { email, emailVerified: true },
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/profile/verify-phone/route.ts src/app/api/profile/verify-email/route.ts
git commit -m "feat: add phone/email verification API"
```

---

### Task 5: Addresses API (CRUD)

**Files:**
- Create: `src/app/api/addresses/route.ts`
- Create: `src/app/api/addresses/[id]/route.ts`

**Interfaces:**
- Consumes: `getSession()` from `@/lib/auth`
- Produces: full CRUD for user addresses, consumed by profile page and checkout

- [ ] **Step 1: Create addresses list + create route

Create `src/app/api/addresses/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, name, phone, district, detail, sfCode, sfName, isDefault } = await req.json();

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { userId: session.userId, label, name, phone, district, detail, sfCode, sfName, isDefault: isDefault ?? false },
  });

  return NextResponse.json(address, { status: 201 });
}
```

- [ ] **Step 2: Create address detail route

Create `src/app/api/addresses/[id]/route.ts`:
```typescript
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = await req.json();

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.userId, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({ where: { id }, data });
  return NextResponse.json(address);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.address.findFirst({ where: { id, userId: session.userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/addresses/
git commit -m "feat: add addresses CRUD API"
```

---

### Task 6: SF Stations Search API

**Files:**
- Create: `src/app/api/sf-stations/route.ts`

**Interfaces:**
- Consumes: `src/data/sf-stations.json`
- Produces: GET `?q=keyword` returns filtered stations

- [ ] **Step 1: Create SF stations search route

```typescript
import { NextResponse } from "next/server";
import stationsData from "@/data/sf-stations.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  if (!q || q.length < 1) return NextResponse.json([]);

  const stations = stationsData.stations.filter((s) =>
    s.code.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.area.toLowerCase().includes(q) ||
    s.district.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q)
  );

  return NextResponse.json(stations.slice(0, 20));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/sf-stations/route.ts
git commit -m "feat: add SF Express station search API"
```

---

### Task 7: Profile Page UI

**Files:**
- Create: `src/app/account/profile/page.tsx`

**Interfaces:**
- Consumes: GET/PATCH `/api/profile`, POST `/api/profile/verify-phone`, POST `/api/profile/verify-email`
- Produces: Full profile management page

- [ ] **Step 1: Create profile page**

```typescript
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
      body: JSON.stringify({ [verifyModal]: newValue }),
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
      body: JSON.stringify({ [verifyModal]: newValue, code: otpCode, otpToken }),
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/account/profile/page.tsx
git commit -m "feat: add profile management page"
```

---

### Task 8: SF Station Picker Component

**Files:**
- Create: `src/components/account/sf-station-picker.tsx`

**Interfaces:**
- Consumes: GET `/api/sf-stations?q=xxx`
- Produces: Reusable picker component returning `{ code, name, district, area, address }` on select

- [ ] **Step 1: Create SF station picker component**

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin } from "lucide-react";

type Station = {
  code: string;
  name: string;
  district: string;
  area: string;
  address: string;
};

export function SfStationPicker({ onSelect }: { onSelect: (station: Station) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = (q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 1) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/sf-stations?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setLoading(false);
    }, 300);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => search(e.target.value)}
          placeholder="搜尋順豐站點名稱、地區或點碼..."
          className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-border bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((s) => (
            <button key={s.code} onClick={() => { onSelect(s); setOpen(false); setQuery(s.name); }}
              className="w-full text-left px-4 py-3 hover:bg-secondary/20 transition-colors flex items-start gap-3 border-b border-border/40 last:border-0">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.district} · {s.area} · {s.code}</p>
                <p className="text-xs text-muted-foreground">{s.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/account/sf-station-picker.tsx
git commit -m "feat: add SF Express station picker component"
```

---

### Task 9: Address Form Component + Page

**Files:**
- Create: `src/app/account/profile/addresses/new/page.tsx`
- Create: `src/app/account/profile/addresses/[id]/page.tsx`
- Create: `src/components/account/address-form.tsx`

**Interfaces:**
- Consumes: `SfStationPicker` from Task 8, addresses API from Task 5
- Produces: Address create/edit forms

- [ ] **Step 1: Create address form component

Create `src/components/account/address-form.tsx`:
```typescript
"use client";

import { useState } from "react";
import { SfStationPicker } from "./sf-station-picker";

type AddressFormProps = {
  initial?: { label: string; name: string; phone: string; district: string; detail: string; sfCode?: string; sfName?: string; isDefault: boolean };
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
};

const DISTRICTS = ["香港島", "九龍", "新界", "離島"];
const LABELS = ["屋企", "公司", "順豐站", "其他"];

export function AddressForm({ initial, onSave, onCancel }: AddressFormProps) {
  const [type, setType] = useState<"custom" | "sf">(initial?.sfCode ? "sf" : "custom");
  const [label, setLabel] = useState(initial?.label || "屋企");
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [district, setDistrict] = useState(initial?.district || "香港島");
  const [detail, setDetail] = useState(initial?.detail || "");
  const [sfCode, setSfCode] = useState(initial?.sfCode || "");
  const [sfName, setSfName] = useState(initial?.sfName || "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault || false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    const ok = await onSave({ label, name, phone, district, detail, sfCode: sfCode || null, sfName: sfName || null, isDefault });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["custom", "sf"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
            {t === "custom" ? "自訂地址" : "順豐站"}
          </button>
        ))}
      </div>

      {type === "sf" ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">搜尋順豐站點</p>
          <SfStationPicker onSelect={(s) => { setSfCode(s.code); setSfName(s.name); setDetail(s.address); setDistrict(s.district); setLabel("順豐站"); }} />
          {sfCode && (
            <div className="mt-3 rounded-lg bg-secondary/20 p-3 text-sm">
              <p className="font-medium">{sfName}</p>
              <p className="text-muted-foreground">{detail}</p>
              <p className="text-muted-foreground">點碼: {sfCode}</p>
            </div>
          )}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">收件人</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">電話</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">標籤</label>
          <select value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm bg-background">
            {LABELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">地區</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm bg-background">
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">詳細地址</label>
        <input value={detail} onChange={(e) => setDetail(e.target.value)} className="w-full rounded-full border border-border h-10 px-4 text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        設為預設地址
      </label>

      <div className="flex gap-3">
        <button onClick={submit} disabled={saving}
          className="rounded-full bg-primary px-6 h-10 text-sm text-primary-foreground font-medium hover:bg-primary/90">
          {initial ? "儲存" : "新增"}
        </button>
        <button onClick={onCancel} className="rounded-full border border-border px-6 h-10 text-sm hover:bg-secondary/20">
          取消
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create new address page

Create `src/app/account/profile/addresses/new/page.tsx`:
```typescript
"use client";

import { useRouter } from "next/navigation";
import { AddressForm } from "@/components/account/address-form";

export default function NewAddressPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-heading text-2xl font-bold mb-6">新增地址</h1>
      <AddressForm
        onSave={async (data) => {
          const res = await fetch("/api/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.ok) { router.push("/account/profile"); return true; }
          return false;
        }}
        onCancel={() => router.push("/account/profile")}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/account/address-form.tsx src/app/account/profile/addresses/
git commit -m "feat: add address create/edit forms"
```

---

### Task 10: Account Page Link Update

**Files:**
- Modify: `src/app/account/page.tsx`

- [ ] **Step 1: Update profile link**

Change the personal profile item link from `href: "#"` to `href: "/account/profile"`:

```typescript
{ icon: User, label: "個人資料", value: "管理", href: "/account/profile" },
```

- [ ] **Step 2: Commit**

```bash
git add src/app/account/page.tsx
git commit -m "fix: link profile card to profile page"
```

---

### Task 11: Checkout Address Integration

**Files:**
- Modify: `src/app/checkout/page.tsx`

**Interfaces:**
- Consumes: GET `/api/profile` for addresses
- Produces: Address selector at checkout

- [ ] **Step 1: Add saved address selector to checkout**

In `src/app/checkout/page.tsx`, add after the initial state declarations:

```typescript
const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
const [useSavedAddress, setUseSavedAddress] = useState(false);

useEffect(() => {
  fetch("/api/profile").then((r) => r.json()).then((d) => {
    if (d.addresses) setSavedAddresses(d.addresses);
  });
}, []);
```

Add before the shipping form:
```tsx
<div className="mb-6">
  <label className="flex items-center gap-2 text-sm mb-4">
    <input type="checkbox" checked={useSavedAddress} onChange={(e) => setUseSavedAddress(e.target.checked)} />
    使用已儲存地址
  </label>

  {useSavedAddress && savedAddresses.length > 0 && (
    <select value="" onChange={(e) => {
      const addr = savedAddresses.find((a) => a.id === e.target.value);
      if (addr) {
        setName(addr.name);
        setPhone(addr.phone);
        setDistrict(addr.district);
        setAddress(addr.detail);
        setShippingMethod(addr.sfCode ? "順豐站自取" : shippingMethod);
      }
    }}
    className="w-full rounded-full border border-border h-11 px-5 text-sm bg-background">
      <option value="">選擇地址</option>
      {savedAddresses.map((a) => (
        <option key={a.id} value={a.id}>{a.label} — {a.detail}</option>
      ))}
    </select>
  )}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/checkout/page.tsx
git commit -m "feat: integrate saved addresses into checkout"
```
