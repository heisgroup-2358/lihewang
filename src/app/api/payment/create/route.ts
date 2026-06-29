import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPayment } from "@/lib/paymentasia";

export async function POST(req: Request) {
  try {
    const { orderId, network } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lihewang.vercel.app";

    const paymentUrl = await createPayment({
      merchant_reference: order.id,
      currency: "HKD",
      amount: order.totalAmount.toFixed(2),
      return_url: `${baseUrl}/order/confirm/${order.id}`,
      notify_url: `${baseUrl}/api/payment/callback`,
      customer_ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1",
      customer_first_name: order.user?.name || "Customer",
      customer_last_name: order.user?.name || "",
      customer_phone: order.user?.phone || "",
      customer_email: order.user?.email || "",
      network,
      subject: `Order ${order.id.slice(0, 8)}`,
      merchant_token: process.env.PAYMENT_MERCHANT_TOKEN!,
      secret_code: process.env.PAYMENT_SECRET_CODE!,
      api_key: process.env.PAYMENT_X_API_KEY!,
      gateway_url: process.env.PAYMENT_GATEWAY_URL || "https://gateway-sandbox.pa-sys.com",
    });

    return NextResponse.json({ payment_url: paymentUrl });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Payment failed" }, { status: 500 });
  }
}
