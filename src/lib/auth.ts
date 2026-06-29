import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import twilio from "twilio";
import { prisma } from "./prisma";

const COOKIE_NAME = "session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  phone: string;
  role: string;
};

const OTP_SECRET = getJwtSecret();

export type OtpPayload = {
  target: string;
  code: string;
};

export async function createOtpToken(target: string, code: string): Promise<string> {
  return await new SignJWT({ target, code })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(OTP_SECRET);
}

export async function verifyOtpToken(token: string, target: string, code: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, OTP_SECRET);
    const otp = payload as unknown as OtpPayload;
    return otp.target === target && otp.code === code;
  } catch {
    return false;
  }
}

export async function createSession(userId: string, phone: string, role: string) {
  const token = await new SignJWT({ userId, phone, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}
