import Link from "next/link";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const DOWNLINES = [
  { name: "張小美", phone: "5111 2233", orders: 3, totalCommission: 120, joined: "2025-01-15" },
  { name: "李小華", phone: "6222 3344", orders: 5, totalCommission: 245, joined: "2025-02-20" },
  { name: "王大明", phone: "7333 4455", orders: 2, totalCommission: 68, joined: "2025-03-08" },
  { name: "陳小玲", phone: "8444 5566", orders: 1, totalCommission: 52, joined: "2025-05-12" },
];

export default function DownlinePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回會員中心
      </Link>

      <h1 className="font-heading text-2xl font-bold">下線管理</h1>

      <div className="mt-6 rounded-xl border border-border/60 p-6">
        <h2 className="text-sm font-semibold mb-2">你的推薦連結</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-secondary/50 px-4 py-2.5 text-sm font-mono text-muted-foreground break-all">
            https://lihewang.com/ref/WH00123
          </code>
          <Button variant="outline" size="icon" className="shrink-0 rounded-full" aria-label="複製">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          分享此連結俾朋友註冊，佢哋落單你就可以賺取佣金
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">姓名</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">電話</th>
              <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">訂單數</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">佣金</th>
              <th className="px-5 py-3.5 text-right font-medium text-muted-foreground hidden sm:table-cell">加入日期</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {DOWNLINES.map((d) => (
              <tr key={d.phone} className="hover:bg-secondary/10 transition-colors">
                <td className="px-5 py-3.5 font-medium">{d.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{d.phone}</td>
                <td className="px-5 py-3.5 text-center">{d.orders}</td>
                <td className="px-5 py-3.5 text-right font-medium">${d.totalCommission}</td>
                <td className="px-5 py-3.5 text-right text-muted-foreground hidden sm:table-cell">{d.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
