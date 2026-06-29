"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Wallet,
  FolderTree,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "儀表板", icon: LayoutDashboard },
  { href: "/admin/products", label: "產品管理", icon: Package },
  { href: "/admin/orders", label: "訂單管理", icon: ShoppingCart },
  { href: "/admin/users", label: "會員管理", icon: Users },
  { href: "/admin/commission", label: "佣金報表", icon: DollarSign },
  { href: "/admin/withdrawals", label: "提現審批", icon: Wallet },
  { href: "/admin/categories", label: "分類管理", icon: FolderTree },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/60 bg-background">
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">
        <Link href="/" className="font-heading text-lg font-bold tracking-wide">
          Admin
        </Link>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">禮盒王</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          返回網站
        </Link>
      </div>
    </aside>
  );
}

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background px-8">
      <p className="text-sm text-muted-foreground">
        管理後台
      </p>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">管理員</span>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">A</span>
        </div>
      </div>
    </header>
  );
}
