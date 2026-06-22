import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandStory() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/20">
              <span className="font-heading text-6xl text-muted-foreground/20">
                🎁
              </span>
            </div>
          </div>

          <div>
            <p className="font-heading text-sm tracking-[0.2em] text-primary uppercase">
              關於禮盒王
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
              每盒禮品
              <br />
              <span className="text-primary">都是一段故事</span>
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              我們親身飛到日本，走訪北海道、東京、京都各地，
              與當地職人建立深厚聯繫。每一盒禮品，都承載著
              「我想把這份美味傳達給你」的心意。
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              從北國的白色戀人到京都的和菓子，我們嚴選品質，
              為你將日本的匠心與溫度直送香港。
            </p>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-8 rounded-full gap-2 inline-flex items-center",
              )}
            >
              了解更多 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
