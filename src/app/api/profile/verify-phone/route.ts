import { NextResponse } from "next/server";
import { getSession, createOtpToken, verifyOtpToken, getTwilioClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
  } catch {
    return NextResponse.json({ error: "Failed to verify phone" }, { status: 500 });
  }
}
