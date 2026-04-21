"use client";

import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CircleDollarSign,
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  Lock,
  LogOut,
  PiggyBank,
  Receipt,
  Workflow,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  protected?: boolean;
  active?: boolean;
};

type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Main",
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
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
      { label: "Profit", icon: HandCoins, href: "/dashboard/profit", protected: true },
      { label: "Taxes", icon: Receipt, href: "/dashboard/profit", protected: true },
    ],
  },
];

type DashboardSidebarProps = {
  isLocked: boolean;
};

export function DashboardSidebar({ isLocked }: DashboardSidebarProps) {
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
    <aside className="flex min-h-[650px] flex-col rounded-2xl border border-border bg-white p-4 shadow-sm">
      {sections.map((section, sectionIndex) => (
        <div
          key={section.title ?? `section-${sectionIndex}`}
          className={sectionIndex === 0 ? "space-y-2" : "mt-6 space-y-2"}
        >
          {section.title ? (
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {section.title}
            </p>
          ) : null}

          {section.items.map((item) => {
            const Icon = item.icon;
            const lockedItem = isLocked && item.protected;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => router.push(lockedItem ? "/pricing" : item.href)}
                className={
                  item.active
                    ? "flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-left text-sm font-semibold text-black"
                    : "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-black hover:bg-zinc-100"
                }
              >
                <Icon className={`h-4 w-4 ${lockedItem ? "text-zinc-400" : "text-primary"}`} />
                <span className="flex items-center gap-2">
                  {item.label}
                  {lockedItem ? <Lock className="h-3.5 w-3.5 text-zinc-500" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-auto pt-6">
        <Button
          type="button"
          onClick={signOut}
          className="w-full justify-center bg-black text-white hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
