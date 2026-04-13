import type { LucideIcon } from "lucide-react";
import {
  CircleDollarSign,
  CreditCard,
  FileText,
  HandCoins,
  Headset,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Receipt,
  Settings,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

type SidebarSection = {
  title?: string;
  items: SidebarItem[];
};

const sections: SidebarSection[] = [
  {
    title: "Main",
    items: [{ label: "Overview", icon: LayoutDashboard, active: true }],
  },
  {
    title: "Transactions",
    items: [
      { label: "Payments", icon: CreditCard },
      { label: "Invoices", icon: FileText },
    ],
  },
  {
    title: "Ledger",
    items: [
      { label: "Expense", icon: PiggyBank },
      { label: "Revenue", icon: CircleDollarSign },
      { label: "Profit", icon: HandCoins },
      { label: "Taxes", icon: Receipt },
    ],
  },
  {
    items: [
      { label: "Support", icon: Headset },
      { label: "Settings", icon: Settings },
    ],
  },
];

type DashboardSidebarProps = {
  onSignOut: () => void;
};

export function DashboardSidebar({ onSignOut }: DashboardSidebarProps) {
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
            return (
              <button
                key={item.label}
                className={
                  item.active
                    ? "flex w-full items-center gap-3 rounded-xl bg-primary/10 px-3 py-2 text-left text-sm font-semibold text-black"
                    : "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-black hover:bg-zinc-100"
                }
              >
                <Icon className="h-4 w-4 text-primary" />
                {item.label}
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-auto pt-6">
        <Button
          type="button"
          onClick={onSignOut}
          className="w-full justify-center bg-black text-white hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
