import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { addresses: { orderBy: { createdAt: "desc" } } },
    });
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      phone: user.phone,
      email: user.email,
      phoneVerified: user.phoneVerified,
      emailVerified: user.emailVerified,
      birthday: user.birthday,
      addresses: user.addresses,
    });
  } catch {
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lastName, firstName, birthday } = await req.json();

    const data: Record<string, unknown> = {};
    if (lastName !== undefined) data.lastName = lastName;
    if (firstName !== undefined) data.firstName = firstName;
    if (birthday !== undefined) data.birthday = birthday ? new Date(birthday) : null;

    const user = await prisma.user.update({
      where: { id: session.userId },
      data,
    });

    return NextResponse.json({
      success: true,
      user: { lastName: user.lastName, firstName: user.firstName, birthday: user.birthday },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
