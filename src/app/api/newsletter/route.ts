import { NextResponse } from "next/server";

const subscribers: string[] = [];

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (subscribers.includes(email)) {
      return NextResponse.json({ message: "Already subscribed" });
    }
    subscribers.push(email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
