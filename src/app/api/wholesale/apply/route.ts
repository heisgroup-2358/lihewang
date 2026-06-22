import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, companyName, contactName, phone, email, businessRegUrl, website, notes, referralCode } = body;

  const existing = await prisma.wholesaleApplication.findUnique({
    where: { userId },
  });

  if (existing) {
    return NextResponse.json({ error: "Application already exists" }, { status: 400 });
  }

  const app = await prisma.wholesaleApplication.create({
    data: {
      userId,
      companyName,
      contactName,
      phone,
      email,
      businessRegUrl,
      website,
      notes,
      referralCode,
    },
  });

  return NextResponse.json({ success: true, applicationId: app.id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const app = await prisma.wholesaleApplication.findUnique({
      where: { userId },
    });
    return NextResponse.json(app ?? { status: "none" });
  }

  const apps = await prisma.wholesaleApplication.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apps);
}
