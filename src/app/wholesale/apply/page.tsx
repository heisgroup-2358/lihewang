import Link from "next/link";
import { Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WholesaleApplyPage() {
  return (
    <>
      <div className="bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">首頁</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">批發申請</span>
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-wide sm:text-4xl">
            批發申請
          </h1>
          <p className="mt-2 text-muted-foreground">
            成為禮盒王批發夥伴，享專屬批發價格及優先預訂服務
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold">批發合作優勢</h3>
              <ul className="mt-4 space-y-4">
                {[
                  { title: "專屬批發價格", desc: "LV1 / LV2 兩級批發定價，利潤更高" },
                  { title: "優先預訂", desc: "新貨到港前優先通知及預訂" },
                  { title: "靈活數量", desc: "一件起批，無最低訂購限制" },
                  { title: "專人客戶服務", desc: "一對一批發客戶專員跟進" },
                  { title: "推薦佣金", desc: "發展下線客戶，賺取佣金回報" },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border/60 p-6 sm:p-8">
              <h3 className="font-heading text-xl font-bold">申請表格</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                填妥資料後，我們將在 1-2 個工作天內審批
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">公司名稱 *</label>
                    <Input className="mt-1.5 rounded-xl border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">聯絡人姓名 *</label>
                    <Input className="mt-1.5 rounded-xl border-border" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">聯絡電話 *</label>
                    <Input className="mt-1.5 rounded-xl border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">電郵 *</label>
                    <Input type="email" className="mt-1.5 rounded-xl border-border" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">商業登記證 *</label>
                  <div className="mt-1.5 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border/60 p-8 text-center hover:border-primary/50 transition-colors">
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        上傳 PDF / JPG / PNG（max 5MB）
                      </p>
                      <p className="text-xs text-muted-foreground">或點擊選擇檔案</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">公司網站 / IG / FB</label>
                  <Input className="mt-1.5 rounded-xl border-border" placeholder="可選" />
                </div>

                <div>
                  <label className="text-sm font-medium">預計每月訂單量 / 備註</label>
                  <textarea className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" rows={3} />
                </div>

                <div>
                  <label className="text-sm font-medium">推薦碼</label>
                  <Input className="mt-1.5 rounded-xl border-border" placeholder="如有推薦人請輸入（可選）" />
                </div>

                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" />
                  我已閱讀並同意批發條款及細則
                </label>

                <Button className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                  提交申請
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
