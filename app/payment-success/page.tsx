import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type PaymentSuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = (await searchParams) ?? {};
  const invoiceIdValue = params.invoiceId;
  const invoiceId = Array.isArray(invoiceIdValue) ? invoiceIdValue[0] : invoiceIdValue;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center px-4 py-16">
      <section className="w-full rounded-2xl border border-neutral-300 bg-white p-8 text-neutral-900 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-800">
          <CheckCircle2 className="h-4 w-4" />
          Payment received
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Thank you</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          Your payment was submitted successfully. The business that sent this invoice will receive
          confirmation from their payment provider.
        </p>
        {invoiceId ? (
          <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
            Reference: <span className="font-mono">{invoiceId}</span>
          </p>
        ) : null}
        <p className="mt-6 text-xs text-neutral-500">
          Powered by{" "}
          <Link href="/" className="underline">
            SmartOps Ledger
          </Link>
        </p>
      </section>
    </main>
  );
}
