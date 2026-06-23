import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export async function GET() {
  const results: Record<string, any> = {};
  
  try {
    const dbUrl = process.env.DATABASE_URL || "not set";
    results.dbUrlPreview = dbUrl.slice(0, 60) + "...";
    
    // Try a simple DNS lookup
    try {
      const url = new URL(dbUrl);
      results.host = url.hostname;
      results.port = url.port;
    } catch {
      results.urlParseError = "could not parse URL";
    }
    
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown", results }, { status: 500 });
  }
}
