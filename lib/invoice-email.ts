/**
 * Sends invoice emails to end clients via EmailJS.
 * Set EMAILJS_TEMPLATE_INVOICE (or reuse a generic template) with params:
 * to_email, client_name, organization_name, invoice_id, amount, due_date, payment_link
 */

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

export type SendInvoiceEmailParams = {
  toEmail: string;
  clientName: string;
  organizationName: string;
  invoiceId: string;
  amountFormatted: string;
  dueDate: string | null;
  paymentLink: string;
};

export async function sendInvoiceEmail(
  params: SendInvoiceEmailParams,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const serviceId = process.env.EMAILJS_SEND_INVOICE_SERVICE_ID;
  const templateId =
    process.env.EMAILJS_SEND_INVOICE_TEMPLATE_ID ??
    process.env.EMAILJS_TEMPLATE_INVOICE_PAYMENT;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      message:
        "EmailJS invoice template is not configured (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_INVOICE, EMAILJS_PUBLIC_KEY).",
    };
  }

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: params.toEmail,
      email: params.toEmail,
      client_name: params.clientName,
      organization_name: params.organizationName,
      invoice_id: params.invoiceId,
      amount: params.amountFormatted,
      due_date: params.dueDate ?? "Upon receipt",
      payment_link: params.paymentLink,
      pay_now_url: params.paymentLink,
      app_name: process.env.APP_PUBLIC_NAME ?? "SmartOps Ledger",
    },
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  try {
    const res = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, message: text || `EmailJS HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, message };
  }
}
