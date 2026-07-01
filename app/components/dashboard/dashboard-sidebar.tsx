"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CircleDollarSign,
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogOut,
  PiggyBank,
  Settings,
  Workflow,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  protected?: boolean;
};

type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Organization", icon: Building2, href: "/dashboard/organization" },
      { label: "Automation", icon: Workflow, href: "/dashboard/automation" },
    ],
  },
  {
    title: "Transactions",
    items: [
      { label: "Payments", icon: CreditCard, href: "/dashboard/payments", protected: true },
      { label: "Invoices", icon: FileText, href: "/dashboard/invoices", protected: true },
    ],
  },
  {
    title: "Ledger",
    items: [
      { label: "Expenses", icon: PiggyBank, href: "/dashboard/expenses", protected: true },
      { label: "Revenue", icon: CircleDollarSign, href: "/dashboard/revenue", protected: true },
      { label: "Profit & taxes", icon: HandCoins, href: "/dashboard/profit", protected: true },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
      { label: "Support", icon: LifeBuoy, href: "/dashboard/support" },
    ],
  },
];

function isNavActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/dashboard") return false;
  return pathname.startsWith(`${href}/`);
}

type DashboardSidebarProps = {
  isLocked: boolean;
};

export function DashboardSidebar({ isLocked }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-zinc-50/90 p-4 lg:w-[260px] lg:border-b-0 lg:border-r lg:border-border">
      {sections.map((section, sectionIndex) => (
        <div
          key={section.title ?? `section-${sectionIndex}`}
          className={sectionIndex === 0 ? "space-y-1" : "mt-6 space-y-1"}
        >
          {section.title ? (
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {section.title}
            </p>
          ) : null}

          {section.items.map((item) => {
            const Icon = item.icon;
            const lockedItem = isLocked && item.protected;
            const active = isNavActive(pathname, item.href);
            const dest = lockedItem ? "/pricing" : item.href;

            return (
              <Link
                key={item.label}
                href={dest}
                className={
                  active
                    ? "flex items-center gap-3 border-l-4 border-primary bg-primary/10 py-2.5 pl-2 pr-3 text-left text-sm font-semibold text-black"
                    : "flex items-center gap-3 border-l-4 border-transparent py-2.5 pl-2 pr-3 text-left text-sm text-black hover:bg-zinc-100"
                }
              >
                <Icon className={`h-4 w-4 shrink-0 ${lockedItem ? "text-zinc-400" : "text-primary"}`} />
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{item.label}</span>
                  {lockedItem ? <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" /> : null}
                </span>
              </Link>
            );
          })}
        </div>
      ))}

      <div className="mt-auto border-t border-border pt-4 lg:pt-6">
        <Button
          type="button"
          onClick={signOut}
          variant="outline"
          className="w-full justify-center border-border"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
