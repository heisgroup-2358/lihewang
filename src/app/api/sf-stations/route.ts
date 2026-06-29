import { NextResponse } from "next/server";
import stationsData from "@/data/sf-stations.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";

  if (!q || q.length < 1) return NextResponse.json([]);

  const stations = stationsData.stations.filter((s) =>
    s.code.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    s.area.toLowerCase().includes(q) ||
    s.district.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q)
  );

  return NextResponse.json(stations.slice(0, 20));
}
