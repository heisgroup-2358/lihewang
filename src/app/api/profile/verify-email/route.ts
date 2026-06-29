import { NextResponse } from "next/server";
import { getSession, createOtpToken, verifyOtpToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, code, otpToken } = await req.json();

    if (!code) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }

      const ip = req.headers.get("x-forwarded-for") || "unknown";
      if (!checkRateLimit(`otp-send:${session.userId}`, 3, 60000) ||
          !checkRateLimit(`otp-send-ip:${ip}`, 10, 60000)) {
        return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
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

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`otp-verify:${session.userId}`, 5, 60000) ||
        !checkRateLimit(`otp-verify-ip:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    if (!otpToken || !(await verifyOtpToken(otpToken, email, code))) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { email, emailVerified: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
  }
}
