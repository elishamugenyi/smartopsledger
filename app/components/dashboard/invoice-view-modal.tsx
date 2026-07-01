"use client";

import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { InvoicePaymentMethods } from "@/lib/invoice-payment-methods";
import { cn } from "@/lib/utils";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceViewRecord = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
  client: { name: string; email: string };
  items: InvoiceItem[];
} & InvoicePaymentMethods;

type InvoiceViewModalProps = {
  open: boolean;
  invoice: InvoiceViewRecord | null;
  onClose: () => void;
};

function formatUsd(cents: number, currency: string) {
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
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function InvoiceViewModal({ open, invoice, onClose }: InvoiceViewModalProps) {
  if (!open || !invoice) return null;

  const description = invoice.items[0]?.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close invoice details"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary">Invoice details</p>
            <h2 className="mt-1 text-xl font-bold text-foreground">{invoice.client.name}</h2>
            <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatUsd(invoice.amount, invoice.currency)}
            </p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
            <span
              className={cn(
                "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                statusTone(invoice.status),
              )}
            >
              {invoice.status}
            </span>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Due date</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Not set"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Created</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {description ? (
          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Description</p>
            <p className="mt-1 text-sm text-foreground">{description}</p>
          </div>
        ) : null}

        {(invoice.paymentBankName ||
          invoice.paymentAccountName ||
          invoice.paymentAccountNumber ||
          invoice.paymentSwiftCode ||
          invoice.paymentOtherMethods) && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Payment methods</p>
            <dl className="mt-3 space-y-2 text-sm">
              {invoice.paymentBankName ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-medium text-foreground">{invoice.paymentBankName}</dd>
                </div>
              ) : null}
              {invoice.paymentAccountName ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Account name</dt>
                  <dd className="font-medium text-foreground">{invoice.paymentAccountName}</dd>
                </div>
              ) : null}
              {invoice.paymentAccountNumber ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Account number</dt>
                  <dd className="font-medium text-foreground">{invoice.paymentAccountNumber}</dd>
                </div>
              ) : null}
              {invoice.paymentSwiftCode ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">SWIFT</dt>
                  <dd className="font-medium text-foreground">{invoice.paymentSwiftCode}</dd>
                </div>
              ) : null}
              {invoice.paymentOtherMethods ? (
                <div>
                  <dt className="text-muted-foreground">Other methods</dt>
                  <dd className="mt-1 whitespace-pre-wrap font-medium text-foreground">
                    {invoice.paymentOtherMethods}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
