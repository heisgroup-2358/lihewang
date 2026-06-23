import { ADMIN_USERS, WHOLESALE_APPLICATIONS } from "@/lib/admin-mock-data";
import { Badge } from "@/components/ui/badge";

const ROLE_LABELS: Record<string, string> = {
  wholesale_lv1: "批發 LV1",
  wholesale_lv2: "批發 LV2",
  member: "普通會員",
};

const ROLE_STYLES: Record<string, string> = {
  wholesale_lv1: "bg-purple-100 text-purple-700 border-0",
  wholesale_lv2: "bg-indigo-100 text-indigo-700 border-0",
  member: "bg-blue-100 text-blue-700 border-0",
};

const APP_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-0",
  approved: "bg-green-100 text-green-700 border-0",
  rejected: "bg-red-100 text-red-700 border-0",
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">會員管理</h1>
      <p className="mt-1 text-sm text-muted-foreground">管理會員及批發申請審批</p>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold mb-4">所有會員</h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">姓名</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">電郵</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">角色</th>
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground hidden sm:table-cell">訂單</th>
                <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ADMIN_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="px-5 py-4">
                    <Badge className={ROLE_STYLES[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right text-muted-foreground hidden sm:table-cell">{u.orders}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block h-2 w-2 rounded-full ${u.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-medium text-primary hover:underline">編輯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg font-bold mb-4">批發申請待審批</h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/20">
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">公司</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">聯絡人</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground hidden sm:table-cell">電話</th>
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground hidden sm:table-cell">申請日期</th>
                <th className="px-5 py-3.5 text-center font-medium text-muted-foreground">狀態</th>
                <th className="px-5 py-3.5 text-right font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {WHOLESALE_APPLICATIONS.map((a) => (
                <tr key={a.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-4 font-medium">{a.company}</td>
                  <td className="px-5 py-4">{a.contact}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{a.phone}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground hidden sm:table-cell">{a.date}</td>
                  <td className="px-5 py-4 text-center">
                    <Badge className={APP_STATUS_STYLES[a.status]}>
                      {a.status === "pending" ? "待審批" : a.status === "approved" ? "已批准" : "已拒絕"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {a.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <button className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200">批准</button>
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
    </div>
  );
}
