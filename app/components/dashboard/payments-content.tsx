"use client";

import { useEffect, useState } from "react";

type PaymentRecord = {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  createdAt: string;
  invoice: {
    id: string;
    currency: string;
    client: {
      name: string;
      email: string;
    };
  };
};

type PaymentsResponse = {
  payments: PaymentRecord[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export function PaymentsContent() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: "10",
        });
        if (status !== "all") params.set("status", status);
        if (search.trim()) params.set("search", search.trim());

        const response = await fetch(`/api/dashboard/payments?${params.toString()}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load payments");
        const data = (await response.json()) as PaymentsResponse;
        setPayments(data.payments);
        setPagination(data.pagination);
      } finally {
        setLoading(false);
      }
    };
    void loadPayments();
  }, [page, search, status]);

  if (loading) return <p className="text-sm text-zinc-600">Loading payments...</p>;

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-black">Payments</h1>
      <p className="mt-1 text-sm text-zinc-600">Payment history from your Payment table.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <input
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Search by client or invoice"
          className="rounded-lg border border-border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCEEDED">Succeeded</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {payments.length === 0 ? (
          <p className="text-sm text-zinc-500">No payments found yet.</p>
        ) : (
          payments.map((payment) => (
            <article key={payment.id} className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold text-black">
                ${(payment.amount / 100).toFixed(2)} {payment.invoice.currency.toUpperCase()}
              </p>
              <p className="text-xs text-zinc-600">
                {payment.invoice.client.name} ({payment.invoice.client.email})
              </p>
              <p className="text-xs text-zinc-600">Invoice ID: {payment.invoice.id}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                {payment.status} - {new Date(payment.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
        <p>
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            className="rounded-md border border-border px-3 py-1 disabled:opacity-60"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() =>
              setPage((current) => Math.min(current + 1, pagination.totalPages))
            }
            className="rounded-md border border-border px-3 py-1 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
