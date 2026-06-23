import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { getTwilioClient, setEmailOtp } from "@/lib/auth";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { channel, phone, email } = await req.json();

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
      setEmailOtp(email, code);

      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@lihewang.com",
        subject: "您的驗證碼",
        text: `您的驗證碼是：${code}\n\n此驗證碼將於10分鐘後失效。`,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
