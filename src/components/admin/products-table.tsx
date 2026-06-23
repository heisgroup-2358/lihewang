"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Pencil, Trash2, Upload, Download, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  sales: number;
};

export function ProductsTable({ products }: { products: Product[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleDelete(slug: string) {
    if (!confirm("確定要刪除此產品？")) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/products/bulk", { method: "POST", body: formData });
    if (res.ok) {
      e.target.value = "";
      router.refresh();
    }
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              下載模板
            </Button>
          </a>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            匯入CSV
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              新增產品
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">產品</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">品牌</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">價格</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">庫存</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground hidden sm:table-cell">銷售</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.id}</p>
                </td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{p.brand}</td>
                <td className="px-5 py-4 text-right font-medium">${p.price}</td>
                <td className={`px-5 py-4 text-right ${p.stock === 0 ? "text-destructive font-medium" : ""}`}>
                  {p.stock === 0 ? "缺貨" : p.stock}
                </td>
                <td className="px-5 py-4 text-right text-muted-foreground hidden sm:table-cell">{p.sales}</td>
                <td className="px-5 py-4 text-center">
                  <Badge className={p.status === "active" ? "bg-green-100 text-green-700 border-0" : "bg-red-100 text-red-700 border-0"}>
                    {p.status === "active" ? "上架" : "下架"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
