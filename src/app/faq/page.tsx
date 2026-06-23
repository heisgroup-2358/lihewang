import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "運費如何計算？",
    a: "香港地區訂單滿 $300 即享免運費。未滿 $300 將收取 $30 運費。偏遠地區及離島可能另需附加費。",
  },
  {
    q: "可以送到順豐站自取嗎？",
    a: "可以。結帳時選擇「順豐站自取」即可，運費全免。請填寫你方便取件的順豐站代號。",
  },
  {
    q: "付款方式有哪些？",
    a: "目前支援 Payme 付款。結帳時會顯示 Payme QR Code，使用 Payme App 掃碼即可完成付款。",
  },
  {
    q: "批發會員如何申請？",
    a: "請到批發申請頁面填寫公司資料並上傳商業登記證。我們將在 1-2 個工作天內審批，審批通過後即可享有批發價格。",
  },
  {
    q: "批發會員有最低訂購量嗎？",
    a: "沒有。成為批發會員後，一件都可以用批發價購買，靈活方便。",
  },
  {
    q: "如何賺取佣金？",
    a: "批發會員可以透過推薦連結邀請新客戶註冊。當你的下線客戶落單時，你便可以賺取該訂單利潤的 10%（LV1）或 15%（LV2）作為佣金。",
  },
  {
    q: "佣金如何提取？",
    a: "在會員中心的佣金錢包可以申請提現。填寫銀行戶口資料後，我們會在 3-5 個工作天內轉帳到你的戶口。",
  },
  {
    q: "可以退貨嗎？",
    a: "我們提供 7 日退換服務。如產品有品質問題，請在收貨後 7 日內聯絡我們。食品類產品一經開封恕不退換。",
  },
  {
    q: "產品從日本運送到香港需時多久？",
    a: "現貨產品一般 2-3 個工作天送達。預購產品需 7-14 個工作天。如有急單可聯絡我們安排。",
  },
  {
    q: "如何聯絡客服？",
    a: "可以 WhatsApp 5111 1234 或電郵至 hello@lihewang.com。辦公時間為星期一至五 10:00-19:00。",
  },
];

export default function FAQPage() {
  return (
    <>
      <div className="bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold tracking-wide">
            常見問題
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            關於訂購、批發、佣金及配送的常見疑問
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border/60 transition-colors open:border-primary/30 open:bg-primary/[0.02]"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-medium">
                {faq.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/40 px-6 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-secondary/30 p-8 text-center">
          <h2 className="font-heading text-lg font-bold">仲有其他問題？</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            隨時聯絡我哋，我哋樂意為你解答
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <span className="font-medium">WhatsApp 5111 1234</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-medium">hello@lihewang.com</span>
          </div>
        </div>
      </div>
    </>
  );
}
