"use client";

import { useEffect, useState } from "react";

type RevenueResponse = {
  totals: {
    revenue: number;
    expense: number;
  };
  summary: {
    profitOrLoss: number;
    state: "profit" | "loss";
  };
};

export function RevenueContent() {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-sm text-zinc-600">Loading revenue summary...</p>;
  if (!data) return <p className="text-sm text-zinc-600">No revenue data available.</p>;

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-black">Revenue</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Simple profit/loss from entries in the Expense table.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Revenue</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700">
            ${(data.totals.revenue / 100).toFixed(2)}
          </p>
        </article>
        <article className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Expenses</p>
          <p className="mt-1 text-xl font-semibold text-red-700">
            ${(data.totals.expense / 100).toFixed(2)}
          </p>
        </article>
        <article className="rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Profit/Loss</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              data.summary.state === "profit" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            ${(data.summary.profitOrLoss / 100).toFixed(2)}
          </p>
        </article>
      </div>
    </section>
  );
}
