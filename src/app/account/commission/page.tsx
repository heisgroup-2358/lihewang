import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COMMISSION_HISTORY = [
  { date: "2025-06-20", order: "#ORD-1024", downline: "張小美", amount: 40, status: "已結算" },
  { date: "2025-06-18", order: "#ORD-1022", downline: "李小華", amount: 65, status: "已結算" },
  { date: "2025-06-15", order: "#ORD-1018", downline: "王大明", amount: 28, status: "已結算" },
  { date: "2025-06-12", order: "#ORD-1010", downline: "陳小玲", amount: 52, status: "結算中" },
  { date: "2025-06-08", order: "#ORD-1005", downline: "張小美", amount: 36, status: "已結算" },
];

export default function CommissionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回會員中心
      </Link>

      <h1 className="font-heading text-2xl font-bold">佣金錢包</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 p-5">
          <p className="text-xs text-muted-foreground">可提現</p>
          <p className="mt-1 font-heading text-3xl font-bold text-primary">$2,340</p>
        </div>
        <div className="rounded-xl border border-border/60 p-5">
          <p className="text-xs text-muted-foreground">待結算</p>
          <p className="mt-1 font-heading text-3xl font-bold">$680</p>
        </div>
        <div className="rounded-xl border border-border/60 p-5">
          <p className="text-xs text-muted-foreground">累計佣金</p>
          <p className="mt-1 font-heading text-3xl font-bold">$12,450</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border/60 p-6">
        <h2 className="font-heading text-lg font-bold">申請提現</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">提取金額</label>
            <Input className="mt-1.5 rounded-xl border-border" placeholder="HKD" />
          </div>
          <div>
            <label className="text-sm font-medium">銀行</label>
            <select className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm">
              <option>HSBC 滙豐銀行</option>
              <option>Bank of China 中國銀行</option>
              <option>Hang Seng 恒生銀行</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">戶口名稱</label>
            <Input className="mt-1.5 rounded-xl border-border" />
          </div>
          <div>
            <label className="text-sm font-medium">戶口號碼</label>
            <Input className="mt-1.5 rounded-xl border-border" />
          </div>
        </div>

        <Button className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
          申請提現
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold mb-4">最近佣金記錄</h2>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">日期</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">訂單</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">下線</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">金額</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {COMMISSION_HISTORY.map((row) => (
                <tr key={row.order} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-3.5">{row.date}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{row.order}</td>
                  <td className="px-5 py-3.5">{row.downline}</td>
                  <td className="px-5 py-3.5 text-right font-medium">${row.amount}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-xs font-medium ${row.status === "已結算" ? "text-green-600" : "text-amber-600"}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
