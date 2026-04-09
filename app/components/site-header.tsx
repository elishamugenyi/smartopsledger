"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, Sparkles, User2 } from "lucide-react";
import { navLinks } from "@/app/data/store";
import { useCart } from "@/app/store/cart";
import { cn } from "@/lib/utils";

const topLinks = [...navLinks, { href: "/login", label: "Login" }, { href: "/cart", label: "Cart" }];

export function SiteHeader() {
  const pathname = usePathname();
  const itemCount = useCart((state) => state.itemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
              Smart Stop
            </p>
            <p className="text-lg font-black tracking-tight text-foreground">
              Ledger
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-white/80 p-1 shadow-sm lg:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-secondary px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Login
          </Link>
          <Link
            href="/account"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60"
          >
            <User2 className="h-4 w-4" />
            Account
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {mounted && itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-black text-secondary">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>

        <details className="relative lg:hidden">
          <summary className="list-none rounded-full border border-border bg-white p-3 shadow-sm">
            <Menu className="h-5 w-5 text-foreground" />
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-border bg-white p-3 shadow-2xl shadow-black/10">
            <div className="mb-3 rounded-2xl bg-secondary px-4 py-3 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                <Sparkles className="h-4 w-4" />
                Quick menu
              </div>
              <p className="mt-1 text-lg font-bold">Browse Smart Stop Ledger</p>
            </div>
            <div className="grid gap-1">
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                    pathname === link.href
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
