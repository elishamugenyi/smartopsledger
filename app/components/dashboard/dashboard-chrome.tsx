"use client";

import Link from "next/link";
import { Bell, LifeBuoy } from "lucide-react";
import { DashboardSidebar } from "@/app/components/dashboard/dashboard-sidebar";

type DashboardChromeProps = {
  userEmail: string;
  isLocked: boolean;
  children: React.ReactNode;
};

export function DashboardChrome({ userEmail, isLocked, children }: DashboardChromeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-background">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-6">
            <Link
              href="/dashboard"
              className="shrink-0 text-base font-semibold tracking-tight text-foreground hover:text-primary sm:text-lg"
            >
              SmartOps Ledger
            </Link>
            <span className="hidden h-6 w-px shrink-0 bg-border md:block" aria-hidden />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Notifications"
              title="Notifications coming soon"
              disabled
            >
              <Bell className="h-4 w-4" />
            </button>

            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted hover:text-primary sm:px-3"
            >
              <LifeBuoy className="h-4 w-4 shrink-0 text-primary" />
              <span className="hidden sm:inline">Support</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="max-w-[140px] truncate rounded-md px-2 py-1.5 text-sm font-medium text-foreground underline-offset-4 hover:bg-muted hover:text-primary hover:underline sm:max-w-[220px] sm:px-3"
              title="Open settings"
            >
              {userEmail}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <DashboardSidebar isLocked={isLocked} />
        <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-background lg:border-l lg:border-border">
          {children}
        </div>
      </div>
    </div>
  );
}
