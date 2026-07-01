"use client";

import {
  CheckCircle2,
  FileText,
  MoreHorizontal,
  Plus,
  Send,
  Settings2,
  Eye,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { InvoicePaymentMethodsModal } from "@/app/components/dashboard/invoice-payment-methods-modal";
import {
  InvoiceViewModal,
  type InvoiceViewRecord,
} from "@/app/components/dashboard/invoice-view-modal";
import type { InvoicePaymentMethods } from "@/lib/invoice-payment-methods";
import { cn } from "@/lib/utils";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceRecord = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  client: {
    name: string;
    email: string;
  };
  items: InvoiceItem[];
} & InvoicePaymentMethods;

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

type Toast = {
  id: string;
  message: string;
  tone: "success" | "error";
};

function formatUsd(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function statusTone(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "OVERDUE":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    case "SENT":
    case "VIEWED":
      return "bg-primary/10 text-primary";
    case "CANCELLED":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
}

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
            toast.tone === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-200"
              : "border-red-200 bg-red-50/95 text-red-900 dark:border-red-900/50 dark:bg-red-950/90 dark:text-red-200",
          )}
          role="status"
        >
          {toast.tone === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : null}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="rounded-md p-1 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

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
  const [statusFilter, setStatusFilter] = useState("DRAFT");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewInvoice, setViewInvoice] = useState<InvoiceViewRecord | null>(null);
  const [manageInvoiceId, setManageInvoiceId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const pushToast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const loadInvoices = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
    });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (search.trim()) params.set("search", search.trim());

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(`/api/dashboard/invoices?${params.toString()}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = (await response.json()) as InvoicesResponse;
        setInvoices(data.invoices);
        setTotals(data.totals);
        setPagination(data.pagination);
        return true;
      }
      if (response.status === 503 && attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        continue;
      }
      return false;
    }
    return false;
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

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const onCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);

    const form = new FormData(formElement);
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
      formElement.reset();
      setStatusFilter("DRAFT");
      setPage(1);
      await loadInvoices();
      pushToast("Invoice created as draft successfully.");
    } catch {
      pushToast("Could not create invoice. Check your inputs and try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onSendInvoice = async (invoiceId: string) => {
    setSending(invoiceId);
    setOpenMenuId(null);
    try {
      const response = await fetch(`/api/dashboard/invoices/${invoiceId}/send`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await response.json()) as {
        error?: string;
        hint?: string;
        emailSent?: boolean;
        emailError?: string;
        paymentLinkUrl?: string;
      };
      if (!response.ok) {
        throw new Error(data.hint ?? data.error ?? "send_failed");
      }
      if (data.emailSent) {
        pushToast("Invoice sent with payment link.");
      } else if (data.paymentLinkUrl) {
        pushToast(
          `Payment link created${data.emailError ? ` but email failed: ${data.emailError}` : ""}. Share the link manually.`,
        );
      } else {
        pushToast("Invoice marked as sent.");
      }
      await loadInvoices();
    } catch (err) {
      const message = err instanceof Error ? err.message : "send_failed";
      pushToast(
        message.includes("Stripe") || message.includes("Connect")
          ? message
          : "Could not send invoice. Check Stripe Connect and client email.",
        "error",
      );
    } finally {
      setSending(null);
    }
  };

  const onUpdateStatus = async (invoiceId: string, nextStatus: string) => {
    setStatusUpdating(invoiceId);
    setOpenMenuId(null);
    const previousInvoices = invoices;
    const previousTotals = totals;

    try {
      const response = await fetch(`/api/dashboard/invoices/${invoiceId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error("Failed to update invoice status");

      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: nextStatus } : invoice,
        ),
      );

      if (nextStatus === "PAID") {
        setTotals((current) => ({
          paid: current.paid + 1,
          pending: Math.max(0, current.pending - 1),
        }));
      }

      const refreshed = await loadInvoices();
      if (nextStatus === "PAID") {
        pushToast(
          refreshed
            ? "Invoice marked as paid."
            : "Invoice marked as paid. Refresh the page if the list looks out of date.",
        );
      } else {
        pushToast(
          refreshed ? "Invoice status updated." : "Invoice status updated. List refresh is delayed.",
        );
      }
    } catch {
      setInvoices(previousInvoices);
      setTotals(previousTotals);
      pushToast("Unable to update invoice status right now.", "error");
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) {
    return (
      <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading invoices...
      </p>
    );
  }

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,163,74,0.1),transparent_40%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-sm font-medium text-primary">Billing</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">Invoices</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create draft invoices, manage payment methods, and track what is paid or still pending.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <Plus className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Create invoice</h2>
                <p className="text-sm text-muted-foreground">
                  New invoices start as drafts. Payment details from your last invoice are copied
                  automatically.
                </p>
              </div>
            </div>

            <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={onCreateInvoice}>
              <input
                name="clientName"
                placeholder="Client name"
                className="rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground"
                required
              />
              <input
                name="clientEmail"
                type="email"
                placeholder="Client email"
                className="rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground"
                required
              />
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount (USD)"
                className="rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground"
                required
              />
              <input
                name="dueDate"
                type="date"
                className="rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground"
              />
              <input
                name="description"
                placeholder="Invoice description"
                className="rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground sm:col-span-2"
              />
              <button
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 sm:col-span-2 sm:w-fit"
              >
                <FileText className="h-4 w-4" aria-hidden />
                {submitting ? "Creating..." : "Create draft invoice"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <article className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-card p-5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Paid invoices
              </p>
              <p className="mt-2 text-4xl font-bold text-emerald-700 dark:text-emerald-400">
                {totals.paid}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Successfully collected and closed.</p>
            </article>
            <article className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-card p-5 shadow-sm dark:border-amber-900/40 dark:from-amber-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pending invoices
              </p>
              <p className="mt-2 text-4xl font-bold text-amber-700 dark:text-amber-400">
                {totals.pending}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Draft, sent, viewed, or overdue — not yet paid.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Invoice register</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Draft and other invoices in a quick-scan table. Use the action menu for more options.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search invoice or client"
                className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
              />
              <select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value);
                }}
                className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
              >
                <option value="DRAFT">Draft</option>
                <option value="all">All statuses</option>
                <option value="SENT">Sent</option>
                <option value="VIEWED">Viewed</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Due</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No invoices found for this filter.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => {
                    const description = invoice.items[0]?.description;
                    const canSend =
                      invoice.status !== "PAID" && invoice.status !== "CANCELLED";
                    const canMarkPaid = invoice.status !== "PAID" && invoice.status !== "CANCELLED";

                    return (
                      <tr
                        key={invoice.id}
                        className={
                          index % 2 === 0
                            ? "border-b border-border/60 bg-background/40"
                            : "border-b border-border/60"
                        }
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{invoice.client.name}</p>
                          <p className="text-xs text-muted-foreground">{invoice.client.email}</p>
                          {description ? (
                            <p className="mt-1 max-w-[14rem] truncate text-xs text-muted-foreground">
                              {description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 font-semibold tabular-nums text-foreground">
                          {formatUsd(invoice.amount, invoice.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                              statusTone(invoice.status),
                            )}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {invoice.dueDate
                            ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="relative px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId((current) =>
                                current === invoice.id ? null : invoice.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                            aria-label={`Actions for ${invoice.client.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openMenuId === invoice.id ? (
                            <div
                              ref={menuRef}
                              className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-border bg-card p-1 shadow-lg"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setViewInvoice(invoice);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setManageInvoiceId(invoice.id);
                                  setOpenMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                              >
                                <Settings2 className="h-4 w-4 text-muted-foreground" />
                                Manage
                              </button>
                              {canSend ? (
                                <button
                                  type="button"
                                  onClick={() => onSendInvoice(invoice.id)}
                                  disabled={sending === invoice.id}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted disabled:opacity-60"
                                >
                                  <Send className="h-4 w-4 text-primary" />
                                  {sending === invoice.id ? "Sending..." : "Send"}
                                </button>
                              ) : null}
                              {canMarkPaid ? (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(invoice.id, "PAID")}
                                  disabled={statusUpdating === invoice.id}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted disabled:opacity-60"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  {statusUpdating === invoice.id ? "Updating..." : "Mark as paid"}
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-60"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, pagination.totalPages))
                }
                className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      <InvoiceViewModal
        open={Boolean(viewInvoice)}
        invoice={viewInvoice}
        onClose={() => setViewInvoice(null)}
      />

      <InvoicePaymentMethodsModal
        open={Boolean(manageInvoiceId)}
        invoiceId={manageInvoiceId}
        onClose={() => setManageInvoiceId(null)}
        onSaved={() => {
          pushToast("Payment methods saved for this invoice.");
          void loadInvoices();
        }}
      />
    </>
  );
}
