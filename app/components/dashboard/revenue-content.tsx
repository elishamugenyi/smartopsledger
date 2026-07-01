"use client";

import { ArrowDownLeft, ArrowUpRight, CalendarDays, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
};

type RevenueResponse = {
  entries: Entry[];
  totals: {
    revenue: number;
    expense: number;
  };
  summary: {
    profitOrLoss: number;
    state: "profit" | "loss";
  };
};

type MonthStat = {
  key: string;
  label: string;
  revenue: number;
  expense: number;
  profit: number;
  entries: Entry[];
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getMonthKey(value: string | Date) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatShortMonth(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function groupByDescription(entries: Entry[]) {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    const label = entry.description?.trim() || "Uncategorized";
    totals.set(label, (totals.get(label) ?? 0) + entry.amount);
  }
  return [...totals.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function buildMonthlyStats(entries: Entry[]): MonthStat[] {
  const map = new Map<string, MonthStat>();

  for (const entry of entries) {
    const key = getMonthKey(entry.createdAt);
    const existing = map.get(key) ?? {
      key,
      label: formatMonthLabel(key),
      revenue: 0,
      expense: 0,
      profit: 0,
      entries: [],
    };

    if (entry.category.toLowerCase() === "revenue") {
      existing.revenue += entry.amount;
    } else {
      existing.expense += entry.amount;
    }
    existing.entries.push(entry);
    map.set(key, existing);
  }

  return [...map.values()]
    .map((month) => ({ ...month, profit: month.revenue - month.expense }))
    .sort((a, b) => b.key.localeCompare(a.key));
}

type BarChartProps = {
  months: MonthStat[];
  selectedMonth: string;
  onSelectMonth: (key: string) => void;
};

function MonthlyBarChart({ months, selectedMonth, onSelectMonth }: BarChartProps) {
  const chartMonths = [...months].reverse().slice(-6);
  const maxValue = Math.max(
    ...chartMonths.map((month) => Math.max(month.revenue, month.expense)),
    1,
  );

  if (chartMonths.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Add transactions to see monthly trends.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
          Revenue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" />
          Expenses
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {chartMonths.map((month) => {
          const revenueHeight = Math.round((month.revenue / maxValue) * 100);
          const expenseHeight = Math.round((month.expense / maxValue) * 100);
          const isSelected = selectedMonth === month.key;

          return (
            <button
              key={month.key}
              type="button"
              onClick={() => onSelectMonth(month.key)}
              className={cn(
                "group rounded-xl border p-3 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-background/60 hover:border-primary/40 hover:bg-muted/40",
              )}
            >
              <p className="text-xs font-medium text-muted-foreground">{formatShortMonth(month.key)}</p>
              <div className="mt-3 flex h-28 items-end justify-center gap-2">
                <div className="flex w-5 flex-col items-center gap-1">
                  <div className="flex h-20 w-full items-end justify-center">
                    <div
                      className="w-full rounded-t-md bg-emerald-500 transition-all group-hover:bg-emerald-400"
                      style={{ height: `${Math.max(revenueHeight, month.revenue > 0 ? 8 : 0)}%` }}
                      title={`Revenue: ${formatUsd(month.revenue)}`}
                    />
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" aria-hidden />
                </div>
                <div className="flex w-5 flex-col items-center gap-1">
                  <div className="flex h-20 w-full items-end justify-center">
                    <div
                      className="w-full rounded-t-md bg-red-500 transition-all group-hover:bg-red-400"
                      style={{ height: `${Math.max(expenseHeight, month.expense > 0 ? 8 : 0)}%` }}
                      title={`Expenses: ${formatUsd(month.expense)}`}
                    />
                  </div>
                  <ArrowDownLeft className="h-3 w-3 text-red-600" aria-hidden />
                </div>
              </div>
              <p
                className={cn(
                  "mt-2 text-center text-xs font-semibold tabular-nums",
                  month.profit >= 0 ? "text-emerald-600" : "text-red-600",
                )}
              >
                {month.profit >= 0 ? "+" : ""}
                {formatUsd(month.profit)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type InsightListProps = {
  title: string;
  subtitle: string;
  items: Array<{ label: string; amount: number }>;
  variant: "expense" | "revenue";
  emptyMessage: string;
};

function InsightList({ title, subtitle, items, variant, emptyMessage }: InsightListProps) {
  const isExpense = variant === "expense";
  const maxAmount = items[0]?.amount ?? 1;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm",
        isExpense
          ? "border-red-200/80 bg-gradient-to-b from-red-50/50 to-card dark:border-red-900/40 dark:from-red-950/20"
          : "border-emerald-200/80 bg-gradient-to-b from-emerald-50/50 to-card dark:border-emerald-900/40 dark:from-emerald-950/20",
      )}
    >
      <div className="flex items-start gap-2">
        {isExpense ? (
          <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
        ) : (
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
        )}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.slice(0, 5).map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-foreground">{item.label}</span>
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    isExpense ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {formatUsd(item.amount)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    isExpense ? "bg-red-500" : "bg-emerald-500",
                  )}
                  style={{ width: `${Math.max((item.amount / maxAmount) * 100, 6)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type MonthHighlightProps = {
  title: string;
  months: MonthStat[];
  pick: "revenue" | "expense" | "profit";
};

function MonthHighlights({ title, months, pick }: MonthHighlightProps) {
  const sorted = [...months].sort((a, b) => {
    if (pick === "revenue") return b.revenue - a.revenue;
    if (pick === "expense") return b.expense - a.expense;
    return b.profit - a.profit;
  });
  const top = sorted.filter((month) => {
    if (pick === "revenue") return month.revenue > 0;
    if (pick === "expense") return month.expense > 0;
    return month.profit !== 0;
  }).slice(0, 3);

  const colorClass =
    pick === "expense"
      ? "text-red-600 dark:text-red-400"
      : pick === "revenue"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {top.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Not enough data yet.</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {top.map((month, index) => {
            const value =
              pick === "revenue" ? month.revenue : pick === "expense" ? month.expense : month.profit;
            return (
              <li key={month.key} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">
                  {index + 1}. {formatShortMonth(month.key)}
                </span>
                <span className={cn("font-semibold tabular-nums", colorClass)}>
                  {pick === "profit" && value > 0 ? "+" : ""}
                  {formatUsd(value)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export function RevenueContent() {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/dashboard/revenue", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load revenue summary");
        const payload = (await response.json()) as RevenueResponse;
        setData(payload);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const entries = data?.entries ?? [];
  const monthlyStats = useMemo(() => buildMonthlyStats(entries), [entries]);

  useEffect(() => {
    if (monthlyStats.length === 0) return;
    const currentMonth = getMonthKey(new Date());
    const hasCurrentMonth = monthlyStats.some((month) => month.key === currentMonth);
    setSelectedMonth(hasCurrentMonth ? currentMonth : monthlyStats[0].key);
  }, [monthlyStats]);

  const scopedEntries = useMemo(() => {
    if (selectedMonth === "all") return entries;
    return entries.filter((entry) => getMonthKey(entry.createdAt) === selectedMonth);
  }, [entries, selectedMonth]);

  const scopedTotals = useMemo(() => {
    return scopedEntries.reduce(
      (acc, entry) => {
        if (entry.category.toLowerCase() === "revenue") {
          acc.revenue += entry.amount;
        } else {
          acc.expense += entry.amount;
        }
        return acc;
      },
      { revenue: 0, expense: 0 },
    );
  }, [scopedEntries]);

  const scopedProfit = scopedTotals.revenue - scopedTotals.expense;
  const selectedMonthStat = monthlyStats.find((month) => month.key === selectedMonth);

  const topExpenses = useMemo(
    () => groupByDescription(scopedEntries.filter((entry) => entry.category.toLowerCase() !== "revenue")),
    [scopedEntries],
  );
  const topRevenue = useMemo(
    () => groupByDescription(scopedEntries.filter((entry) => entry.category.toLowerCase() === "revenue")),
    [scopedEntries],
  );

  const scopeLabel =
    selectedMonth === "all" ? "all time" : (selectedMonthStat?.label.toLowerCase() ?? "selected month");

  if (loading) {
    return (
      <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading revenue summary...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No revenue data available.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Revenue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profit and loss from your expense and revenue entries, with monthly trends and insights.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Revenue</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-400">
              {formatUsd(data.totals.revenue)}
            </p>
          </article>
          <article className="rounded-xl border border-red-200/80 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Expenses</p>
            <p className="mt-1 text-xl font-semibold text-red-700 dark:text-red-400">
              {formatUsd(data.totals.expense)}
            </p>
          </article>
          <article className="rounded-xl border border-border bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Profit / Loss</p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold",
                data.summary.state === "profit"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-red-700 dark:text-red-400",
              )}
            >
              {formatUsd(data.summary.profitOrLoss)}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Monthly overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a month bar to drill into that period. Showing the last six months with activity.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="font-medium">View month</span>
            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            >
              <option value="all">All months</option>
              {monthlyStats.map((month) => (
                <option key={month.key} value={month.key}>
                  {month.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <MonthlyBarChart
          months={monthlyStats}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          {selectedMonth === "all" ? "All-time snapshot" : selectedMonthStat?.label}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Breakdown for {scopeLabel}.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatUsd(scopedTotals.revenue)}
            </p>
          </article>
          <article className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expenses</p>
            <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-400">
              {formatUsd(scopedTotals.expense)}
            </p>
          </article>
          <article className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Net</p>
            <p
              className={cn(
                "mt-1 text-lg font-semibold",
                scopedProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {scopedProfit >= 0 ? "+" : ""}
              {formatUsd(scopedProfit)}
            </p>
          </article>
        </div>

        {scopedEntries.length > 0 ? (
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {scopedEntries.map((entry, index) => {
                  const isRevenue = entry.category.toLowerCase() === "revenue";
                  return (
                    <tr
                      key={entry.id}
                      className={index % 2 === 0 ? "border-b border-border/60 bg-background/40" : "border-b border-border/60"}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                            isRevenue
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400",
                          )}
                        >
                          {isRevenue ? "Revenue" : "Expense"}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 font-semibold tabular-nums",
                          isRevenue ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {isRevenue ? "+" : "−"}
                        {formatUsd(entry.amount)}
                      </td>
                      <td className="max-w-[12rem] truncate px-4 py-3 text-foreground sm:max-w-none">
                        {entry.description?.trim() || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No transactions for this period.</p>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            See where money goes out, what brings revenue in, and which months stand out.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <InsightList
            title="Top spending areas"
            subtitle={`Largest expense descriptions for ${scopeLabel}`}
            items={topExpenses}
            variant="expense"
            emptyMessage="No expenses recorded for this period."
          />
          <InsightList
            title="Top revenue drivers"
            subtitle={`Largest revenue descriptions for ${scopeLabel}`}
            items={topRevenue}
            variant="revenue"
            emptyMessage="No revenue recorded for this period."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MonthHighlights title="Strongest revenue months" months={monthlyStats} pick="revenue" />
          <MonthHighlights title="Highest expense months" months={monthlyStats} pick="expense" />
          <MonthHighlights title="Best profit months" months={monthlyStats} pick="profit" />
        </div>
      </section>
    </div>
  );
}
