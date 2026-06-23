import { getCommissionTransactions } from "@/lib/admin-data-service";

export default async function AdminCommissionPage() {
  const COMMISSION_REPORT = await getCommissionTransactions();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">佣金報表</h1>
      <p className="mt-1 text-sm text-muted-foreground">查看批發會員佣金概況</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "總佣金支出", value: "$8,900" },
          { label: "已結算", value: "$6,890" },
          { label: "待結算", value: "$2,010" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/60 bg-background p-5">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-heading text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">會員</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">下線數</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">訂單數</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">累計佣金</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">已結算</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">待結算</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {COMMISSION_REPORT.map((r) => (
              <tr key={r.user} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4 font-medium">{r.user}</td>
                <td className="px-5 py-4 text-right">{r.downlines}</td>
                <td className="px-5 py-4 text-right">{r.orders}</td>
                <td className="px-5 py-4 text-right font-medium">${r.commission}</td>
                <td className="px-5 py-4 text-right text-green-600">${r.paid}</td>
                <td className="px-5 py-4 text-right text-amber-600">${r.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
