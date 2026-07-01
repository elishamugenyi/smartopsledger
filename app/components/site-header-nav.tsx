"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

const navLinkClass =
  "font-bold text-black underline-offset-4 transition-colors hover:underline hover:decoration-primary hover:decoration-2";

const dropdownItemClass =
  "block px-4 py-2 text-sm font-bold text-black underline-offset-4 transition-colors hover:underline hover:decoration-primary hover:decoration-2";

const dropdownLabelClass =
  "px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500";

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

export function SiteHeaderNav() {
  return (
    <nav
      className="flex min-w-0 items-center justify-evenly gap-6 px-4 sm:gap-8 sm:px-6 lg:gap-10 lg:px-10"
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
        <Link href="/getting-started#getting-started" className={dropdownItemClass}>
          Getting started
        </Link>
        <Link href="/getting-started#chat-support" className={dropdownItemClass}>
          Chat support
        </Link>
        <Link href="/getting-started#faqs" className={dropdownItemClass}>
          FAQs
        </Link>
      </NavDropdown>
    </nav>
  );
}
