"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Upload, Download, Plus, Search, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  productCode: string | null;
  price: number;
  stock: number;
  status: string;
  sortOrder: number;
  sales: number;
};

export function ProductsTable({ products }: { products: Product[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortField, setSortField] = useState<"sortOrder" | "name" | "price">("sortOrder");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [delPassword, setDelPassword] = useState("");
  const [delSlug, setDelSlug] = useState<string | null>(null);

  const filtered = products
    .filter((p) => {
      if (filter === "active" && p.status !== "active") return false;
      if (filter === "inactive" && p.status !== "inactive") return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.productCode || "").toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "sortOrder") return (a.sortOrder - b.sortOrder) * mul;
      if (sortField === "name") return a.name.localeCompare(b.name) * mul;
      return (a.price - b.price) * mul;
    });

  async function toggleStatus(slug: string, currentActive: boolean) {
    const res = await fetch(`/api/products/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentActive }),
    });
    if (res.ok) router.refresh();
  }

  async function handleDelete(slug: string) {
    if (!delPassword) { alert("請輸入刪除密碼"); return; }
    const res = await fetch(`/api/products/${slug}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: delPassword }),
    });
    if (res.ok) { setDelSlug(null); setDelPassword(""); router.refresh(); }
    else alert("刪除密碼錯誤");
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">產品管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理所有產品</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/products/template.csv" download>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> 下載模板</Button>
          </a>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const fd = new FormData(); fd.append("file", f); fetch("/api/products/bulk", { method: "POST", body: fd }).then((r) => { if (r.ok) { e.target.value = ""; router.refresh(); } }); }} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> 匯入CSV</Button>
          <Link href="/admin/products/new"><Button size="sm"><Plus className="h-4 w-4" /> 新增產品</Button></Link>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜尋商品名稱、SKU、品牌..."
            className="w-full rounded-full border border-border h-10 pl-9 pr-4 text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-full border border-border h-10 px-4 text-sm bg-background">
          <option value="all">全部</option>
          <option value="active">已上架</option>
          <option value="inactive">已下架</option>
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("name")}>
                產品 {sortField === "name" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />)}
              </th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">品牌</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden md:table-cell">SKU</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("price")}>
                價格 {sortField === "price" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />)}
              </th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">庫存</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("sortOrder")}>
                排序 {sortField === "sortOrder" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />)}
              </th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">上架狀態</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.id.slice(0, 8)}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{p.brand}</td>
                <td className="px-5 py-4 text-xs text-muted-foreground hidden md:table-cell">{p.productCode || "-"}</td>
                <td className="px-5 py-4 text-right font-medium">${p.price}</td>
                <td className={`px-5 py-4 text-right ${p.stock === 0 ? "text-destructive font-medium" : ""}`}>
                  {p.stock === 0 ? "缺貨" : p.stock}
                </td>
                <td className="px-5 py-4 text-center text-xs text-muted-foreground">{p.sortOrder}</td>
                <td className="px-5 py-4 text-center">
                  <button onClick={() => toggleStatus(p.slug, p.status === "active")}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      p.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                    {p.status === "active" ? "上架" : "下架"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/products/${p.slug}`} target="_blank">
                      <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setDelSlug(p.slug)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">無符合條件的產品</p>
      )}

      {delSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-lg">
            <h3 className="font-bold text-lg">確認刪除</h3>
            <p className="mt-1 text-sm text-muted-foreground">請輸入管理員密碼以刪除此產品</p>
            <input type="password" value={delPassword} onChange={(e) => setDelPassword(e.target.value)}
              placeholder="輸入刪除密碼" autoFocus
              className="mt-4 w-full rounded-full border border-border h-11 px-5 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleDelete(delSlug)} />
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 rounded-full" onClick={() => handleDelete(delSlug)}>確認刪除</Button>
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => { setDelSlug(null); setDelPassword(""); }}>取消</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
