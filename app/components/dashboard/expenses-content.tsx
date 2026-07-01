"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ExpenseEntry = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
};

function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type TransactionColumnProps = {
  title: string;
  variant: "expense" | "revenue";
  entries: ExpenseEntry[];
};

function TransactionColumn({ title, variant, entries }: TransactionColumnProps) {
  const isExpense = variant === "expense";
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const Icon = isExpense ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className={
        isExpense
          ? "overflow-hidden rounded-2xl border border-red-200/80 bg-gradient-to-b from-red-50/80 to-card shadow-sm dark:border-red-900/50 dark:from-red-950/30"
          : "overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/80 to-card shadow-sm dark:border-emerald-900/50 dark:from-emerald-950/30"
      }
    >
      <div
        className={
          isExpense
            ? "flex items-center justify-between gap-3 border-b border-red-200/80 bg-red-100/60 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/40"
            : "flex items-center justify-between gap-3 border-b border-emerald-200/80 bg-emerald-100/60 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/40"
        }
      >
        <div className="flex items-center gap-2">
          <span
            className={
              isExpense
                ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400"
                : "inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h3
              className={
                isExpense
                  ? "text-base font-semibold text-red-800 dark:text-red-300"
                  : "text-base font-semibold text-emerald-800 dark:text-emerald-300"
              }
            >
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>
        <p
          className={
            isExpense
              ? "text-lg font-bold tabular-nums text-red-700 dark:text-red-400"
              : "text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400"
          }
        >
          {formatUsd(total)}
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          No {isExpense ? "expenses" : "revenue"} recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={
                    index % 2 === 0
                      ? "border-b border-border/50 bg-background/40"
                      : "border-b border-border/50"
                  }
                >
                  <td className="px-4 py-3">
                    <span
                      className={
                        isExpense
                          ? "inline-flex rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400"
                          : "inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400"
                      }
                    >
                      {isExpense ? "Expense" : "Revenue"}
                    </span>
                  </td>
                  <td
                    className={
                      isExpense
                        ? "px-4 py-3 font-semibold tabular-nums text-red-600 dark:text-red-400"
                        : "px-4 py-3 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {isExpense ? "−" : "+"}
                    {formatUsd(entry.amount)}
                  </td>
                  <td className="max-w-[10rem] truncate px-4 py-3 text-foreground sm:max-w-none">
                    {entry.description?.trim() || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function ExpensesContent() {
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadEntries = async () => {
    const response = await fetch("/api/dashboard/expenses", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to load entries");
    const data = (await response.json()) as { entries: ExpenseEntry[] };
    setEntries(data.entries);
  };

  useEffect(() => {
    const run = async () => {
      try {
        await loadEntries();
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const expenseEntries = useMemo(
    () => entries.filter((entry) => entry.category === "expense"),
    [entries],
  );
  const revenueEntries = useMemo(
    () => entries.filter((entry) => entry.category === "revenue"),
    [entries],
  );

  const onCreateEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    const form = new FormData(formElement);

    const payload = {
      amount: Number(form.get("amount") || 0),
      category: String(form.get("category") || "").toLowerCase(),
      description: String(form.get("description") || ""),
    };

    try {
      const response = await fetch("/api/dashboard/expenses", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save transaction");
      formElement.reset();
      await loadEntries();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record each transaction as expense or revenue.
        </p>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreateEntry}>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Amount (USD)"
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            required
          />
          <select
            name="category"
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            defaultValue="expense"
          >
            <option value="expense">Expense</option>
            <option value="revenue">Revenue</option>
          </select>
          <input
            name="description"
            placeholder="Description"
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground md:col-span-2"
          />
          <button
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Transaction"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Transaction Ledger</h2>
            <p className="text-sm text-muted-foreground">
              Expenses on the left, revenue on the right — color-coded for quick scanning.
            </p>
          </div>
          {!loading && entries.length > 0 ? (
            <p className="text-sm font-medium text-muted-foreground">
              Net:{" "}
              <span
                className={
                  revenueEntries.reduce((sum, e) => sum + e.amount, 0) -
                    expenseEntries.reduce((sum, e) => sum + e.amount, 0) >=
                  0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {formatUsd(
                  revenueEntries.reduce((sum, e) => sum + e.amount, 0) -
                    expenseEntries.reduce((sum, e) => sum + e.amount, 0),
                )}
              </span>
            </p>
          ) : null}
        </div>

        {loading ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading entries...
          </p>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            <TransactionColumn title="Expenses" variant="expense" entries={expenseEntries} />
            <TransactionColumn title="Revenue" variant="revenue" entries={revenueEntries} />
          </div>
        )}
      </section>
    </div>
  );
}
