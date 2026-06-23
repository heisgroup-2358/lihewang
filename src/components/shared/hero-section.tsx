import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-gradient-to-br from-secondary/80 via-background to-secondary/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="mb-4 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {SITE.tagline}
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          由日本直送
          <br />
          <span className="text-primary">為你傳遞心意</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          每盒禮品．都是一段故事。我們親身飛到日本，走訪各地職人，
          為您搜羅最精緻的禮盒。
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-w-[180px] rounded-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center",
            )}
          >
            探索禮盒
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-w-[180px] rounded-full inline-flex items-center justify-center",
            )}
          >
            了解更多
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border border-muted-foreground/30">
          <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
    </section>
  );
}
