import { NextResponse } from "next/server";
import { getTwilioClient, createSession, verifyOtpToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { channel, phone, email, code, name, referralCode, otpToken } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Verification code required" }, { status: 400 });
    }

    if (channel === "whatsapp") {
      if (!phone) {
        return NextResponse.json({ error: "Phone required" }, { status: 400 });
      }
      if (otpToken && !(await verifyOtpToken(otpToken, phone, code))) {
        return NextResponse.json({ error: "Invalid code" }, { status: 400 });
      }
      const client = getTwilioClient();
      if (client && !otpToken) {
        const verificationCheck = await client.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
          .verificationChecks.create({ to: phone, code });
        if (verificationCheck.status !== "approved") {
          return NextResponse.json({ error: "Invalid code" }, { status: 400 });
        }
      }

      let user = await prisma.user.findFirst({ where: { phone } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: name ?? undefined },
        });
      } else {
        user = await prisma.user.create({
          data: {
            phone,
            email: email ?? undefined,
            name: name ?? "User",
            referralCode: `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          },
        });
      }

      if (referralCode) {
        const referrer = await prisma.user.findUnique({ where: { referralCode } });
        if (referrer && referrer.id !== user.id) {
          await prisma.user.update({ where: { id: user.id }, data: { uplineId: referrer.id } });
        }
      }

      await createSession(user.id, user.phone, user.role);
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
    }

    if (channel === "email") {
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }
      if (!otpToken || !(await verifyOtpToken(otpToken, email, code))) {
        return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
      }

      let user = await prisma.user.findFirst({ where: { email } });
      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: name ?? undefined },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            phone: phone ?? "",
            name: name ?? "User",
            referralCode: `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          },
        });
      }

      if (referralCode) {
        const referrer = await prisma.user.findUnique({ where: { referralCode } });
        if (referrer && referrer.id !== user.id) {
          await prisma.user.update({ where: { id: user.id }, data: { uplineId: referrer.id } });
        }
      }

      await createSession(user.id, user.phone, user.role);
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
    }

    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Verification failed" }, { status: 500 });
  }
}
