"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type InvoiceRecord = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
};

type InvoicesResponse = {
  invoices: InvoiceRecord[];
  totals: { paid: number; pending: number };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export function InvoicesContent() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [totals, setTotals] = useState({ paid: 0, pending: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
    });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());

    const response = await fetch(`/api/dashboard/invoices?${params.toString()}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to load invoices");
    const data = (await response.json()) as InvoicesResponse;
    setInvoices(data.invoices);
    setTotals(data.totals);
    setPagination(data.pagination);
  }, [page, search, statusFilter]);

  useEffect(() => {
    const run = async () => {
      try {
        await loadInvoices();
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [loadInvoices]);

  const onCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      clientName: String(form.get("clientName") || ""),
      clientEmail: String(form.get("clientEmail") || ""),
      amount: Number(form.get("amount") || 0),
      dueDate: String(form.get("dueDate") || ""),
      description: String(form.get("description") || ""),
    };

    try {
      const response = await fetch("/api/dashboard/invoices", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create invoice");
      event.currentTarget.reset();
      await loadInvoices();
    } catch {
      setError("Could not create invoice. Check your inputs and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onUpdateStatus = async (invoiceId: string, nextStatus: string) => {
    setStatusUpdating(invoiceId);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/invoices/${invoiceId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Failed to update invoice status");
      await loadInvoices();
    } catch {
      setError("Unable to update invoice status right now.");
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) return <p className="text-sm text-zinc-600">Loading invoices...</p>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Invoices</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Create invoice requests and track paid or pending invoices.
        </p>

        <div className="mt-3 flex gap-3 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            Paid: {totals.paid}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            Pending: {totals.pending}
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Create Invoice</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreateInvoice}>
          <input name="clientName" placeholder="Client name" className="rounded-lg border border-border px-3 py-2 text-sm" required />
          <input name="clientEmail" type="email" placeholder="Client email" className="rounded-lg border border-border px-3 py-2 text-sm" required />
          <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount (USD)" className="rounded-lg border border-border px-3 py-2 text-sm" required />
          <input name="dueDate" type="date" className="rounded-lg border border-border px-3 py-2 text-sm" />
          <input name="description" placeholder="Invoice description" className="rounded-lg border border-border px-3 py-2 text-sm md:col-span-2" />
          <button disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70">
            {submitting ? "Creating..." : "Create Invoice"}
          </button>
        </form>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Created Invoices</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Search invoice or client"
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(event.target.value);
            }}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="VIEWED">Viewed</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="mt-4 space-y-3">
          {invoices.length === 0 ? (
            <p className="text-sm text-zinc-500">No invoices yet.</p>
          ) : (
            invoices.map((invoice) => (
              <article key={invoice.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-black">
                  ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                </p>
                <p className="text-xs text-zinc-600">
                  {invoice.client.name} ({invoice.client.email})
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                  {invoice.status} - {new Date(invoice.createdAt).toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <select
                    defaultValue={invoice.status}
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    onChange={(event) => onUpdateStatus(invoice.id, event.target.value)}
                    disabled={statusUpdating === invoice.id}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="VIEWED">Viewed</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  {statusUpdating === invoice.id ? (
                    <span className="text-xs text-zinc-500">Updating...</span>
                  ) : null}
                </div>
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
      </section>
    </div>
  );
}
