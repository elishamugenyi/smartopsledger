"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { InvoicePaymentMethods } from "@/lib/invoice-payment-methods";

type PaymentTemplate = InvoicePaymentMethods & { label: string };

type InvoicePaymentMethodsModalProps = {
  open: boolean;
  invoiceId: string | null;
  onClose: () => void;
  onSaved: () => void;
};

const emptyMethods: InvoicePaymentMethods = {
  paymentBankName: "",
  paymentAccountName: "",
  paymentAccountNumber: "",
  paymentSwiftCode: "",
  paymentOtherMethods: "",
};

export function InvoicePaymentMethodsModal({
  open,
  invoiceId,
  onClose,
  onSaved,
}: InvoicePaymentMethodsModalProps) {
  const [methods, setMethods] = useState(emptyMethods);
  const [templates, setTemplates] = useState<PaymentTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !invoiceId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [invoiceResponse, templatesResponse] = await Promise.all([
          fetch(`/api/dashboard/invoices/${invoiceId}/payment-methods`, {
            credentials: "include",
          }),
          fetch("/api/dashboard/invoices/payment-methods/recent", {
            credentials: "include",
          }),
        ]);

        if (invoiceResponse.ok) {
          const data = (await invoiceResponse.json()) as { invoice: InvoicePaymentMethods };
          setMethods({
            paymentBankName: data.invoice.paymentBankName ?? "",
            paymentAccountName: data.invoice.paymentAccountName ?? "",
            paymentAccountNumber: data.invoice.paymentAccountNumber ?? "",
            paymentSwiftCode: data.invoice.paymentSwiftCode ?? "",
            paymentOtherMethods: data.invoice.paymentOtherMethods ?? "",
          });
        }

        if (templatesResponse.ok) {
          const data = (await templatesResponse.json()) as { templates: PaymentTemplate[] };
          setTemplates(data.templates);
        }
      } catch {
        setError("Could not load payment methods.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [open, invoiceId]);

  if (!open || !invoiceId) return null;

  const applyTemplate = (index: number) => {
    const template = templates[index];
    if (!template) return;
    setMethods({
      paymentBankName: template.paymentBankName ?? "",
      paymentAccountName: template.paymentAccountName ?? "",
      paymentAccountNumber: template.paymentAccountNumber ?? "",
      paymentSwiftCode: template.paymentSwiftCode ?? "",
      paymentOtherMethods: template.paymentOtherMethods ?? "",
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard/invoices/${invoiceId}/payment-methods`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(methods),
      });
      if (!response.ok) throw new Error("save_failed");
      onSaved();
      onClose();
    } catch {
      setError("Could not save payment methods. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close payment methods"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-primary">Manage invoice</p>
            <h2 className="mt-1 text-xl font-bold text-foreground">Payment methods</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add bank details and other payment options for this invoice. Reuse saved templates
              from previous invoices to save time.
            </p>
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

        {templates.length > 0 ? (
          <div className="mt-5">
            <label className="text-sm font-medium text-foreground" htmlFor="payment-template">
              Use previous payment details
            </label>
            <select
              id="payment-template"
              defaultValue=""
              onChange={(event) => applyTemplate(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            >
              <option value="" disabled>
                Select a saved template
              </option>
              {templates.map((template, index) => (
                <option key={`${template.label}-${index}`} value={index}>
                  {template.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading payment details...</p>
        ) : (
          <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
            <input
              value={methods.paymentBankName ?? ""}
              onChange={(event) =>
                setMethods((current) => ({ ...current, paymentBankName: event.target.value }))
              }
              placeholder="Bank name"
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            <input
              value={methods.paymentAccountName ?? ""}
              onChange={(event) =>
                setMethods((current) => ({ ...current, paymentAccountName: event.target.value }))
              }
              placeholder="Account name"
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            <input
              value={methods.paymentAccountNumber ?? ""}
              onChange={(event) =>
                setMethods((current) => ({ ...current, paymentAccountNumber: event.target.value }))
              }
              placeholder="Account number"
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            <input
              value={methods.paymentSwiftCode ?? ""}
              onChange={(event) =>
                setMethods((current) => ({ ...current, paymentSwiftCode: event.target.value }))
              }
              placeholder="SWIFT / BIC code"
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            <textarea
              value={methods.paymentOtherMethods ?? ""}
              onChange={(event) =>
                setMethods((current) => ({ ...current, paymentOtherMethods: event.target.value }))
              }
              placeholder="Other payment methods (mobile money, PayPal, crypto, etc.)"
              rows={4}
              className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save payment methods"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
