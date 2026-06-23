import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-dev-secret-do-not-use-in-prod");

const protectedRoutes = ["/account", "/wholesale", "/api/orders", "/api/cart", "/api/withdrawals"];
const adminRoutes = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r));

  if (!isProtected && !isAdmin) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (isAdmin) {
      const role = payload.role as string;
      if (!role.startsWith("wholesale") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/wholesale/:path*", "/api/orders", "/api/cart", "/api/withdrawals"],
};
