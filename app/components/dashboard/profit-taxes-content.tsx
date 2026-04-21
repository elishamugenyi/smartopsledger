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

export function ProfitTaxesContent() {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/dashboard/revenue", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load profit and tax summary");
        const payload = (await response.json()) as RevenueResponse;
        setData(payload);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  if (loading) return <p className="text-sm text-zinc-600">Loading profit and taxes...</p>;
  if (!data) return <p className="text-sm text-zinc-600">No data available.</p>;

  const estimatedTax = data.summary.profitOrLoss > 0 ? Math.round(data.summary.profitOrLoss * 0.2) : 0;

  return (
    <section className="space-y-5">
      <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Profit & Taxes</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Use this view to monitor profitability and get a working tax estimate.
        </p>
      </article>

      <article className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Revenue</p>
          <p className="mt-1 text-xl font-semibold text-emerald-700">
            ${(data.totals.revenue / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Expenses</p>
          <p className="mt-1 text-xl font-semibold text-red-700">
            ${(data.totals.expense / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Profit/Loss</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              data.summary.state === "profit" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            ${(data.summary.profitOrLoss / 100).toFixed(2)}
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Taxes Workspace</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Estimated tax (20% of profit): <span className="font-semibold">${(estimatedTax / 100).toFixed(2)}</span>
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          You can use this section to prepare and review taxes as you refine your records.
        </p>
      </article>
    </section>
  );
}
