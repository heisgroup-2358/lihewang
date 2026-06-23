import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCallbackSignature } from "@/lib/paymentasia";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-signature") || "";

    const secret = process.env.PAYMENT_SECRET_CODE;
    if (secret && !verifyCallbackSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const { merchant_reference, status } = body;

    if (!merchant_reference) {
      return NextResponse.json({ error: "Missing merchant_reference" }, { status: 400 });
    }

    const paymentStatus = status === "1" || status === 1 ? "paid" : "failed";

    await prisma.order.update({
      where: { id: merchant_reference },
      data: { paymentStatus },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Callback failed" }, { status: 500 });
  }
}
