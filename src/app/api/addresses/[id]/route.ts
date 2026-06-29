import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;

    const address = await prisma.address.findFirst({ where: { id, userId: session.userId } });
    if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(address);
  } catch {
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.address.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { label, name, phone, district, detail, sfCode, sfName, isDefault } = await req.json();
    const data: Record<string, unknown> = { label, name, phone, district, detail, sfCode, sfName };
    if (isDefault !== undefined) data.isDefault = isDefault;

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({ where: { id }, data });
    return NextResponse.json(address);
  } catch {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.address.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
