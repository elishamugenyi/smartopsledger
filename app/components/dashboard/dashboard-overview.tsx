"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CircleDollarSign,
  FileText,
  HandCoins,
  PiggyBank,
  Plus,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardStatCard } from "@/app/components/dashboard/dashboard-stat-card";
import type { DashboardAccessState } from "@/lib/access-control";
import { cn } from "@/lib/utils";

type LedgerEntry = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
};

type RevenueResponse = {
  entries: LedgerEntry[];
  totals: { revenue: number; expense: number };
  summary: { profitOrLoss: number; state: "profit" | "loss" };
};

type Invoice = {
  id: string;
  amount: number;
  status: string;
  dueDate: string | null;
  createdAt: string;
  client: { name: string; email: string };
};

type InvoicesResponse = {
  invoices: Invoice[];
  pagination: { total: number };
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  invoice: {
    id: string;
    client: { name: string };
  };
};

type PaymentsResponse = {
  payments: Payment[];
  pagination: { total: number };
};

type DashboardOverviewProps = {
  accessState: DashboardAccessState;
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatPercentChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "New this month" : "No change from last month";
  }
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}% vs last month`;
}

function isSameMonth(date: Date, year: number, month: number) {
  return date.getFullYear() === year && date.getMonth() === month;
}

function sumByCategory(entries: LedgerEntry[], category: "revenue" | "expense", year: number, month: number) {
  return entries.reduce((total, entry) => {
    if (entry.category.toLowerCase() !== category) return total;
    const createdAt = new Date(entry.createdAt);
    if (!isSameMonth(createdAt, year, month)) return total;
    return total + entry.amount;
  }, 0);
}

function isDueWithinDays(dueDate: string | null, days: number) {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);
  return due >= now && due <= end;
}

type QuickAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  protected?: boolean;
};

const quickActions: QuickAction[] = [
  { label: "Record transaction", href: "/dashboard/expenses", icon: Plus, protected: true },
  { label: "Create invoice", href: "/dashboard/invoices", icon: FileText, protected: true },
  { label: "View revenue", href: "/dashboard/revenue", icon: CircleDollarSign, protected: true },
  { label: "Profit & taxes", href: "/dashboard/profit", icon: HandCoins, protected: true },
];

export function DashboardOverview({ accessState }: DashboardOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pendingInvoiceTotal, setPendingInvoiceTotal] = useState(0);
  const [invoiceStatusCounts, setInvoiceStatusCounts] = useState({
    draft: 0,
    sent: 0,
    viewed: 0,
    overdue: 0,
    paid: 0,
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [succeededPaymentTotal, setSucceededPaymentTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const pendingStatuses = ["DRAFT", "SENT", "VIEWED", "OVERDUE", "PAID"] as const;
        const [
          revenueResponse,
          invoicesResponse,
          paymentsResponse,
          ...statusResponses
        ] = await Promise.all([
          fetch("/api/dashboard/revenue", { credentials: "include" }),
          fetch("/api/dashboard/invoices?pageSize=50", { credentials: "include" }),
          fetch("/api/dashboard/payments?pageSize=8", { credentials: "include" }),
          ...pendingStatuses.map((status) =>
            fetch(`/api/dashboard/invoices?status=${status}&pageSize=1`, {
              credentials: "include",
            }),
          ),
        ]);

        if (revenueResponse.ok) {
          setRevenueData((await revenueResponse.json()) as RevenueResponse);
        }

        if (invoicesResponse.ok) {
          const payload = (await invoicesResponse.json()) as InvoicesResponse;
          setInvoices(payload.invoices);
        }

        if (paymentsResponse.ok) {
          const payload = (await paymentsResponse.json()) as PaymentsResponse;
          setPayments(payload.payments);
        }

        const statusTotals = await Promise.all(
          statusResponses.map(async (response) => {
            if (!response.ok) return 0;
            const payload = (await response.json()) as InvoicesResponse;
            return payload.pagination?.total ?? 0;
          }),
        );

        const [draft, sent, viewed, overdue, paid] = statusTotals;
        setInvoiceStatusCounts({ draft, sent, viewed, overdue, paid });
        setPendingInvoiceTotal(draft + sent + viewed + overdue);

        const succeededResponse = await fetch(
          "/api/dashboard/payments?status=SUCCEEDED&pageSize=1",
          { credentials: "include" },
        );
        if (succeededResponse.ok) {
          const payload = (await succeededResponse.json()) as PaymentsResponse;
          setSucceededPaymentTotal(payload.pagination?.total ?? 0);
        }
      } catch {
        setError("Some dashboard data could not be loaded. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthYear = lastMonthDate.getFullYear();
  const lastMonth = lastMonthDate.getMonth();

  const entries = revenueData?.entries ?? [];

  const monthRevenue = useMemo(
    () => sumByCategory(entries, "revenue", currentYear, currentMonth),
    [entries, currentYear, currentMonth],
  );
  const monthExpense = useMemo(
    () => sumByCategory(entries, "expense", currentYear, currentMonth),
    [entries, currentYear, currentMonth],
  );
  const lastMonthRevenue = useMemo(
    () => sumByCategory(entries, "revenue", lastMonthYear, lastMonth),
    [entries, lastMonthYear, lastMonth],
  );
  const monthProfit = monthRevenue - monthExpense;
  const estimatedTax = monthProfit > 0 ? Math.round(monthProfit * 0.2) : 0;

  const dueThisWeek = invoices.filter(
    (invoice) =>
      invoice.status !== "PAID" &&
      invoice.status !== "CANCELLED" &&
      isDueWithinDays(invoice.dueDate, 7),
  ).length;

  const recentEntries = useMemo(
    () => [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
    [entries],
  );

  const monthTrend = useMemo(() => {
    const months: Array<{ key: string; label: string; revenue: number; expense: number }> = [];
    for (let offset = 2; offset >= 0; offset -= 1) {
      const date = new Date(currentYear, currentMonth - offset, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      months.push({
        key,
        label: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: sumByCategory(entries, "revenue", date.getFullYear(), date.getMonth()),
        expense: sumByCategory(entries, "expense", date.getFullYear(), date.getMonth()),
      });
    }
    return months;
  }, [entries, currentYear, currentMonth]);

  const trendMax = Math.max(...monthTrend.flatMap((month) => [month.revenue, month.expense]), 1);

  const invoicePipeline = useMemo(
    () => ({
      draft: invoiceStatusCounts.draft,
      sent: invoiceStatusCounts.sent + invoiceStatusCounts.viewed,
      overdue: invoiceStatusCounts.overdue,
      paid: invoiceStatusCounts.paid,
    }),
    [invoiceStatusCounts],
  );

  const locked = accessState.isLocked;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,163,74,0.12),transparent_42%)]"
          aria-hidden
        />
        <div className="relative">
          <p className="text-sm font-medium text-primary">SmartOps Ledger</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">Overview</h1>
          {accessState.hasActiveSubscription ? (
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
              Your subscription is active. All dashboard modules are unlocked.
            </p>
          ) : accessState.isTrialActive ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Trial active: {accessState.trialDaysRemaining} day
              {accessState.trialDaysRemaining === 1 ? "" : "s"} remaining.
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
              Your 3-day free access has ended. Locked modules redirect to pricing.
            </p>
          )}
        </div>
      </section>

      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="This Month Revenue"
          value={loading ? "—" : formatUsd(monthRevenue)}
          detail={
            loading
              ? "Loading monthly totals..."
              : formatPercentChange(monthRevenue, lastMonthRevenue)
          }
          icon={TrendingUp}
          href="/dashboard/revenue"
          locked={locked}
          tone="success"
        />
        <DashboardStatCard
          title="This Month Expenses"
          value={loading ? "—" : formatUsd(monthExpense)}
          detail={
            loading
              ? "Loading monthly totals..."
              : `${entries.filter((entry) => {
                  const date = new Date(entry.createdAt);
                  return (
                    entry.category.toLowerCase() === "expense" &&
                    isSameMonth(date, currentYear, currentMonth)
                  );
                }).length} transactions this month`
          }
          icon={TrendingDown}
          href="/dashboard/expenses"
          locked={locked}
          tone="danger"
        />
        <DashboardStatCard
          title="Pending Invoices"
          value={loading ? "—" : String(pendingInvoiceTotal)}
          detail={
            loading
              ? "Checking invoice pipeline..."
              : dueThisWeek > 0
                ? `${dueThisWeek} due within 7 days`
                : "No invoices due this week"
          }
          icon={FileText}
          href="/dashboard/invoices"
          locked={locked}
          tone="warning"
        />
        <DashboardStatCard
          title="Est. Tax (20%)"
          value={loading ? "—" : formatUsd(estimatedTax)}
          detail={
            loading
              ? "Calculating from profit..."
              : `Net profit this month: ${formatUsd(monthProfit)}`
          }
          icon={Receipt}
          href="/dashboard/profit"
          locked={locked}
          tone={monthProfit >= 0 ? "primary" : "neutral"}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">3-month cash flow</h2>
              <p className="text-sm text-muted-foreground">
                Revenue vs expenses across recent months.
              </p>
            </div>
            <Link
              href={locked ? "/pricing" : "/dashboard/revenue"}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Details
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {loading ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">Loading chart...</p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {monthTrend.map((month) => (
                <div key={month.key} className="rounded-xl border border-border bg-background/60 p-4">
                  <p className="text-sm font-medium text-muted-foreground">{month.label}</p>
                  <div className="mt-4 flex h-24 items-end gap-2">
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-16 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-emerald-500"
                          style={{
                            height: `${Math.max((month.revenue / trendMax) * 100, month.revenue > 0 ? 10 : 0)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Rev</span>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <div className="flex h-16 w-full items-end">
                        <div
                          className="w-full rounded-t-md bg-red-500"
                          style={{
                            height: `${Math.max((month.expense / trendMax) * 100, month.expense > 0 ? 10 : 0)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-red-600 dark:text-red-400">Exp</span>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-center text-xs font-semibold tabular-nums",
                      month.revenue - month.expense >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {formatUsd(month.revenue - month.expense)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Jump straight into common tasks.</p>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isLocked = locked && action.protected;
              return (
                <Link
                  key={action.label}
                  href={isLocked ? "/pricing" : action.href}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
              <p className="text-sm text-muted-foreground">Latest ledger activity.</p>
            </div>
            <Link
              href={locked ? "/pricing" : "/dashboard/expenses"}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading transactions...</p>
          ) : recentEntries.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No transactions yet. Record your first expense or revenue entry.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recentEntries.map((entry) => {
                const isRevenue = entry.category.toLowerCase() === "revenue";
                return (
                  <li key={entry.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {entry.description?.trim() || (isRevenue ? "Revenue entry" : "Expense entry")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-sm font-semibold tabular-nums",
                        isRevenue
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400",
                      )}
                    >
                      {isRevenue ? "+" : "−"}
                      {formatUsd(entry.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invoice pipeline</h2>
              <p className="text-sm text-muted-foreground">
                Status breakdown from your latest invoices.
              </p>
            </div>
            <Link
              href={locked ? "/pricing" : "/dashboard/invoices"}
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Draft", value: invoicePipeline.draft, tone: "text-foreground" },
              { label: "Sent / Viewed", value: invoicePipeline.sent, tone: "text-primary" },
              { label: "Overdue", value: invoicePipeline.overdue, tone: "text-red-600 dark:text-red-400" },
              { label: "Paid", value: invoicePipeline.paid, tone: "text-emerald-600 dark:text-emerald-400" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", item.tone)}>
                  {loading ? "—" : item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-sm font-semibold text-foreground">Payments collected</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {loading ? "—" : succeededPaymentTotal}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Successful payment{succeededPaymentTotal === 1 ? "" : "s"} on record
            </p>
          </div>

          {!loading && payments.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {payments.slice(0, 3).map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="truncate text-foreground">
                    {payment.invoice.client.name}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                    {formatUsd(payment.amount)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  );
}
