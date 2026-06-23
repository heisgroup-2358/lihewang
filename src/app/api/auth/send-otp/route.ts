import { NextResponse } from "next/server";
import { getTwilioClient } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^\+?[1-9]\d{6,14}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const client = getTwilioClient();
    if (!client) {
      return NextResponse.json({ success: true, dev: true });
    }

    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
