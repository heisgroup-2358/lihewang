import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTwilioClient, createOtpToken } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY!);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function verifyCaptcha(token: string): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // dev: skip if not configured
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { channel, phone, email, captchaToken } = await req.json();

    const isValidCaptcha = await verifyCaptcha(captchaToken);
    if (!isValidCaptcha) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    if (channel === "whatsapp") {
      if (!phone || !/^\+?[1-9]\d{6,14}$/.test(phone)) {
        return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
      }
      const client = getTwilioClient();
      if (!client) {
        return NextResponse.json({ success: true, dev: true });
      }
      await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
        .verifications.create({ to: phone, channel: "whatsapp" });
      return NextResponse.json({ success: true });
    }

    if (channel === "email") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }
      const code = generateCode();
      const otpToken = await createOtpToken(email, code);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@lihewang.com",
        to: email,
        subject: "您的驗證碼",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#d97706;">禮盒王 Lihewang</h2>
          <p>您的驗證碼是：</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#fef3c7;border-radius:8px;margin:16px 0;">${code}</div>
          <p style="color:#6b7280;font-size:14px;">此驗證碼將於10分鐘後失效。</p>
        </div>`,
      });

      return NextResponse.json({ success: true, otpToken });
    }

    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
