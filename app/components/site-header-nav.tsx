"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinkClass =
  "font-bold text-black underline-offset-4 transition-colors hover:underline hover:decoration-primary hover:decoration-2";

const dropdownItemClass =
  "block px-4 py-2 text-sm font-bold text-black underline-offset-4 transition-colors hover:underline hover:decoration-primary hover:decoration-2";

const dropdownLabelClass =
  "px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500";

const mobileLinkClass =
  "block rounded-lg px-3 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted";

const mobileSectionLabelClass =
  "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500";

const businessLinks = [
  { href: "/business#freelancers", label: "Freelancers" },
  { href: "/business#invoicing", label: "Invoicing" },
  { href: "/business#accounting-reports", label: "Accounting reports" },
  { href: "/business#automations", label: "Automations" },
] as const;

const supportLinks = [
  { href: "/getting-started#getting-started", label: "Getting started" },
  { href: "/getting-started#chat-support", label: "Chat support" },
  { href: "/getting-started#faqs", label: "FAQs" },
] as const;

function NavDropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <span
        className={`inline-flex cursor-default items-center gap-1 ${navLinkClass}`}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
      </span>
      <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[15rem] rounded-lg border border-border bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <p className={mobileSectionLabelClass}>For Business</p>
      {businessLinks.map((link) => (
        <Link key={link.href} href={link.href} className={mobileLinkClass} onClick={onNavigate}>
          {link.label}
        </Link>
      ))}

      <Link href="/pricing" className={cn(mobileLinkClass, "mt-2")} onClick={onNavigate}>
        Pricing
      </Link>

      <p className={cn(mobileSectionLabelClass, "mt-2")}>Learn &amp; Support</p>
      {supportLinks.map((link) => (
        <Link key={link.href} href={link.href} className={mobileLinkClass} onClick={onNavigate}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeaderNav() {
  return (
    <nav
      className="hidden min-w-0 flex-1 items-center justify-center gap-8 px-4 lg:flex lg:gap-10 lg:px-10"
      aria-label="Main navigation"
    >
      <NavDropdown label="For Business">
        <Link href="/business#freelancers" className={dropdownItemClass}>
          Freelancers
        </Link>
        <p className={dropdownLabelClass}>Features</p>
        <Link href="/business#invoicing" className={dropdownItemClass}>
          Invoicing
        </Link>
        <Link href="/business#accounting-reports" className={dropdownItemClass}>
          Accounting reports
        </Link>
        <Link href="/business#automations" className={dropdownItemClass}>
          Automations
        </Link>
      </NavDropdown>

      <Link href="/pricing" className={navLinkClass}>
        Pricing
      </Link>

      <NavDropdown label="Learn & Support">
        {supportLinks.map((link) => (
          <Link key={link.href} href={link.href} className={dropdownItemClass}>
            {link.label}
          </Link>
        ))}
      </NavDropdown>
    </nav>
  );
}

export function SiteHeaderMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="site-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-16 z-40 bg-black/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="site-mobile-nav"
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background px-5 shadow-lg sm:px-8 lg:hidden"
            aria-label="Main navigation"
          >
            <MobileNavLinks onNavigate={() => setOpen(false)} />
          </nav>
        </>
      ) : null}
    </>
  );
}
