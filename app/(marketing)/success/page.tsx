import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type SuccessPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = (await searchParams) ?? {};
  const sessionIdValue = params.session_id;
  const sessionId = Array.isArray(sessionIdValue)
    ? sessionIdValue[0]
    : sessionIdValue;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-card p-7 shadow-md shadow-black/5 sm:p-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <CheckCircle2 className="h-4 w-4" />
          Payment successful
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your subscription is active
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Stripe confirmed your checkout. You can now continue using your plan
          in SmartOps Ledger.
        </p>

        {sessionId ? (
          <p className="mt-5 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-muted-foreground sm:text-sm">
            Session: <span className="font-mono">{sessionId}</span>
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline">Back to pricing</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
