import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { ADMIN_STATS } from "@/lib/admin-mock-data";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">儀表板</h1>
      <p className="mt-1 text-sm text-muted-foreground">網站營運概覽</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: DollarSign, label: "本月收入", value: `$${(ADMIN_STATS.monthlyRevenue / 1000).toFixed(1)}K`, change: "+12.5%" },
          { icon: ShoppingCart, label: "總訂單", value: ADMIN_STATS.totalOrders, change: `+${ADMIN_STATS.pendingOrders} 待處理` },
          { icon: Package, label: "上架產品", value: ADMIN_STATS.activeProducts, change: `${ADMIN_STATS.totalProducts - ADMIN_STATS.activeProducts} 未上架` },
          { icon: Users, label: "批發會員", value: ADMIN_STATS.wholesaleUsers, change: `${ADMIN_STATS.pendingApplications} 申請待批` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/60 bg-background p-5">
            <div className="flex items-center justify-between">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.change}</span>
            </div>
            <p className="mt-3 font-heading text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-background p-6">
          <h2 className="font-heading text-lg font-bold">快速操作</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "批發申請", count: ADMIN_STATS.pendingApplications, href: "/admin/users" },
              { label: "待發貨", count: ADMIN_STATS.pendingOrders, href: "/admin/orders" },
              { label: "提現審批", count: ADMIN_STATS.pendingWithdrawals, href: "/admin/withdrawals" },
              { label: "低庫存", count: 2, href: "/admin/products" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
              >
                <span className="text-sm font-medium">{item.label}</span>
                {item.count > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-background p-6">
          <h2 className="font-heading text-lg font-bold">收入概覽</h2>
          <div className="mt-4 space-y-4">
            {[
              { label: "本月收入", value: `$${ADMIN_STATS.monthlyRevenue.toLocaleString()}` },
              { label: "累計收入", value: `$${ADMIN_STATS.totalRevenue.toLocaleString()}` },
              { label: "已付佣金", value: `$${ADMIN_STATS.totalCommissionPaid.toLocaleString()}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="font-heading font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
