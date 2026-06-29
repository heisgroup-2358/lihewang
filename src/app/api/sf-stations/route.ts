import { NextResponse } from "next/server";
import storesData from "@/data/sf-stations.json";
import partnersData from "@/data/sf-partners.json";
import lockersData from "@/data/sf-lockers.json";

const ALL_DATA = {
  store: storesData.stations,
  partner: partnersData.stations,
  locker: lockersData.stations,
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";
  const type = searchParams.get("type") || "all";

  if (!q || q.length < 1) return NextResponse.json([]);

  let sources: { code: string; name: string; area: string; district: string; address: string; addressEn?: string; type: string }[] = [];

  if (type === "all") {
    sources = [...ALL_DATA.store, ...ALL_DATA.partner, ...ALL_DATA.locker];
  } else if (type in ALL_DATA) {
    sources = ALL_DATA[type as keyof typeof ALL_DATA];
  }

  const results = sources.filter((s) =>
    s.code.toLowerCase().includes(q) ||
    s.name.toLowerCase().includes(q) ||
    (s.area || "").toLowerCase().includes(q) ||
    s.district.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q) ||
    (s.addressEn || "").toLowerCase().includes(q)
  );

  return NextResponse.json(results.slice(0, 20));
}
