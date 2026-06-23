import Link from "next/link";
import { SITE, CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold">{SITE.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE.tagline}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">產品分類</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">客戶服務</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  關於我們
                </Link>
              </li>
              <li>
                <Link
                  href="/wholesale/apply"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  批發申請
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {SITE.phone}
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {SITE.email}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">關於我們</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  {SITE.address}
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {SITE.businessReg}
                </span>
              </li>
              <li className="flex gap-3 pt-2">
                <span className="text-sm text-muted-foreground">
                  IG: {SITE.social.instagram}
                </span>
                <span className="text-sm text-muted-foreground">
                  FB: {SITE.social.facebook}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.name}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
