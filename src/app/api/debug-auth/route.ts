import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

function secret() {
  const s = process.env.JWT_SECRET;
  return { present: !!s, length: s ? s.length : 0, encoded: new TextEncoder().encode(s || "") };
}

// GET: report JWT_SECRET status + set a test cookie + read existing session cookie
export async function GET() {
  const info = secret();
  const cookieStore = await cookies();
  const existing = cookieStore.get("session")?.value;

  let verifyResult = "no-cookie";
  if (existing) {
    try {
      const { payload } = await jwtVerify(existing, info.encoded);
      verifyResult = `valid: userId=${payload.userId}`;
    } catch (e) {
      verifyResult = `INVALID: ${e instanceof Error ? e.message : "unknown"}`;
    }
  }

  // Set a fresh test cookie
  const testToken = await new SignJWT({ test: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(info.encoded);
  cookieStore.set("debugtest", testToken, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 3600,
  });

  return NextResponse.json({
    jwtSecretPresent: info.present,
    jwtSecretLength: info.length,
    sessionCookiePresent: !!existing,
    sessionVerify: verifyResult,
    debugCookieSet: true,
  });
}
