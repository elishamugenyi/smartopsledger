import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function CancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-card p-7 shadow-md shadow-black/5 sm:p-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-sm font-medium text-amber-700">
          <AlertCircle className="h-4 w-4" />
          Checkout canceled
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          No payment was completed
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          You can return to pricing and restart checkout at any time.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/pricing">
            <Button>Try again</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Go to dashboard</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
