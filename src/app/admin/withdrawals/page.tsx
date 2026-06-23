import { getWithdrawalRequests } from "@/lib/admin-data-service";
import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-0",
  completed: "bg-green-100 text-green-700 border-0",
};

export default async function AdminWithdrawalsPage() {
  const WITHDRAWAL_REQUESTS = await getWithdrawalRequests();
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">提現審批</h1>
      <p className="mt-1 text-sm text-muted-foreground">審批批發會員的佣金提現申請</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "待審批", value: 2, color: "text-amber-600" },
          { label: "本月處理", value: 5, color: "text-green-600" },
          { label: "總提現金額", value: "$8,900", color: "text-foreground" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/60 bg-background p-5">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`mt-1 font-heading text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">申請編號</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">會員</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">金額</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">銀行</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">戶口</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground hidden sm:table-cell">申請日期</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {WITHDRAWAL_REQUESTS.map((w) => (
              <tr key={w.id} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-4 font-medium">{w.id}</td>
                <td className="px-5 py-4">{w.user}</td>
                <td className="px-5 py-4 text-right font-bold">${w.amount}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{w.bank}</td>
                <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell font-mono text-xs">{w.account}</td>
                <td className="px-5 py-4 text-right text-muted-foreground hidden sm:table-cell">{w.date}</td>
                <td className="px-5 py-4 text-center">
                  <Badge className={STATUS_STYLES[w.status]}>
                    {w.status === "pending" ? "待審批" : "已完成"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  {w.status === "pending" && (
                    <div className="flex justify-end gap-1">
                      <button className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200">確認轉帳</button>
                      <button className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200">拒絕</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
