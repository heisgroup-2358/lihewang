import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const VALUES = [
  {
    title: "日本直送",
    description: "我們親身飛到日本，與當地職人建立直接聯繫，確保每件產品都是正品。",
  },
  {
    title: "品質嚴選",
    description: "從產地、包裝到保鮮期，我們嚴格把關，只選最好的禮盒。",
  },
  {
    title: "心意傳遞",
    description: "每盒禮品都承載著送禮者的心意，我們用心包裝，讓收禮者感受到溫暖。",
  },
];

const TEAM_MEMBERS = [
  { name: "陳先生", role: "創辦人・採購總監", desc: "每年飛日本 6 次，走訪各地職人" },
  { name: "李小姐", role: "客戶服務經理", desc: "確保每位顧客都得到最貼心的服務" },
  { name: "張先生", role: "物流主管", desc: "由日本到香港，確保每盒禮品完好送達" },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-secondary/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm tracking-[0.2em] text-primary uppercase font-medium">
            About Us
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-wide sm:text-5xl">
            每盒禮品．都是一段故事
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            由日本直送，為你傳遞心意。我們是香港首家專注日本高級禮盒的線上專門店。
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold">
              我們的
              <span className="text-primary">故事</span>
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              禮盒王創立於 2024 年。我們的創辦人陳先生本身是一名日本文化愛好者，
              多年來走訪日本各地，發現許多優秀的禮盒品牌在香港難以購買。
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              於是，我們決定將這些承載著日本職人匠心的禮盒帶到香港。
              從北海道的白之戀人，到京都的虎屋和菓子，每一款產品都由我們親身挑選。
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              我們不僅是賣禮盒，更希望透過每盒禮品，傳遞送禮者最真摯的心意。
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/60 to-secondary/20">
              <span className="font-heading text-8xl text-muted-foreground/20">🎌</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold">我們的理念</h2>
            <div className="mx-auto mt-3 h-0.5 w-12 bg-primary" />
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl bg-background p-8 text-center shadow-sm">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-lg">✦</span>
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold">我們的團隊</h2>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-primary" />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.name} className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-secondary/40 flex items-center justify-center">
                <span className="text-3xl text-muted-foreground/40">👤</span>
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold">{m.name}</h3>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-secondary/20 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold">準備好成為合作夥伴？</h2>
          <p className="mt-3 text-muted-foreground">
            無論是零售客戶或批發夥伴，我們都歡迎你的查詢
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className={cn(
                buttonVariants(),
                "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center",
              )}
            >
              探索禮盒
            </Link>
            <Link
              href="/wholesale/apply"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full inline-flex items-center",
              )}
            >
              批發申請
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {SITE.phone} · {SITE.email} · {SITE.address}
          </p>
        </div>
      </div>
    </>
  );
}
