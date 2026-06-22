import { SITE } from "@/lib/constants";
import { SectionHeading } from "./section-heading";

const PLACEHOLDER_IMAGES = 4;

export function InstagramFeed() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading>
          <span className="text-primary">@{SITE.social.instagram}</span>
          {" "}真實開箱
        </SectionHeading>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: PLACEHOLDER_IMAGES }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl bg-secondary/50 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary/60 to-secondary/20">
                <span className="font-heading text-3xl text-muted-foreground/30">
                  📸
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          追蹤我們 {SITE.social.instagram}，分享你的開箱喜悅
        </p>
      </div>
    </section>
  );
}
