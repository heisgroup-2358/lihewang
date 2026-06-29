"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin } from "lucide-react";

type Station = {
  code: string;
  name: string;
  district: string;
  area: string;
  address: string;
};

export function SfStationPicker({ onSelect }: { onSelect: (station: Station) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
      const res = await fetch(`/api/sf-stations?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
      setLoading(false);
    }, 300);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => search(e.target.value)}
          placeholder="搜尋順豐站點名稱、地區或點碼..."
          className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full rounded-xl border border-border bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((s) => (
            <button key={s.code} onClick={() => { onSelect(s); setOpen(false); setQuery(s.name); }}
              className="w-full text-left px-4 py-3 hover:bg-secondary/20 transition-colors flex items-start gap-3 border-b border-border/40 last:border-0">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.district} · {s.area} · {s.code}</p>
                <p className="text-xs text-muted-foreground">{s.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
