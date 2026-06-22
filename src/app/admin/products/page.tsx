import { ADMIN_PRODUCTS } from "@/lib/admin-mock-data";
import { Badge } from "@/components/ui/badge";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">產品管理</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理所有產品</p>
        </div>
        <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          新增產品
        </button>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {ADMIN_PRODUCTS.map((p) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
