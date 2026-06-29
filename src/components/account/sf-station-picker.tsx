"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin, Store, ShoppingBag, Luggage } from "lucide-react";

type Station = {
  code: string;
  name: string;
  district: string;
  area: string;
  address: string;
  type: string;
};

const TABS = [
  { key: "store", label: "順豐站", icon: Store },
  { key: "partner", label: "自提點", icon: ShoppingBag },
  { key: "locker", label: "智能櫃", icon: Luggage },
];

export function SfStationPicker({ onSelect }: { onSelect: (station: Station) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("store");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = (q: string) => {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 1) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/sf-stations?q=${encodeURIComponent(q)}&type=${tab}`);
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setLoading(false);
    }, 300);
  };

  const switchTab = (t: string) => {
    setTab(t);
    if (query.length >= 1) {
      setLoading(true);
      fetch(`/api/sf-stations?q=${encodeURIComponent(query)}&type=${t}`)
        .then((r) => r.json())
        .then((data) => { setResults(data); setOpen(data.length > 0); setLoading(false); });
    }
  };

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      store: "bg-amber-100 text-amber-700",
      partner: "bg-blue-100 text-blue-700",
      locker: "bg-purple-100 text-purple-700",
    };
    const labels: Record<string, string> = {
      store: "站",
      partner: "自提點",
      locker: "智能櫃",
    };
    return (
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors[type] || "bg-gray-100"}`}>
        {labels[type] || type}
      </span>
    );
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex gap-1 mb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => switchTab(t.key)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}>
              <Icon className="h-3 w-3" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => search(e.target.value)}
          placeholder="搜尋站點名稱、地區或點碼..."
          className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-border bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((s) => (
            <button key={s.code} onClick={() => { onSelect(s); setOpen(false); setQuery(s.name); }}
              className="w-full text-left px-4 py-3 hover:bg-secondary/20 transition-colors flex items-start gap-3 border-b border-border/40 last:border-0">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  {typeBadge(s.type)}
                </div>
                <p className="text-xs text-muted-foreground">{s.district} · {s.area} · {s.code}</p>
                <p className="text-xs text-muted-foreground truncate">{s.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
