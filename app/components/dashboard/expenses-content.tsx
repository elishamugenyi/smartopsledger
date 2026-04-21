"use client";

import { FormEvent, useEffect, useState } from "react";

type ExpenseEntry = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: string;
};

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

  const onCreateEntry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);

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
      event.currentTarget.reset();
      await loadEntries();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Expenses</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Record each transaction as expense or revenue.
        </p>

        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreateEntry}>
          <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount (USD)" className="rounded-lg border border-border px-3 py-2 text-sm" required />
          <select
            name="category"
            className="rounded-lg border border-border px-3 py-2 text-sm"
            defaultValue="expense"
          >
            <option value="expense">Expense</option>
            <option value="revenue">Revenue</option>
          </select>
          <input name="description" placeholder="Description" className="rounded-lg border border-border px-3 py-2 text-sm md:col-span-2" />
          <button disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70">
            {saving ? "Saving..." : "Save Transaction"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Transaction Entries</h2>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-zinc-600">Loading entries...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-zinc-500">No entries recorded yet.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-black">${(entry.amount / 100).toFixed(2)}</p>
                <p className="text-xs uppercase tracking-wide text-zinc-600">{entry.category}</p>
                {entry.description ? (
                  <p className="text-xs text-zinc-600">{entry.description}</p>
                ) : null}
                <p className="text-xs text-zinc-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
