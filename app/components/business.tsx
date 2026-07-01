import type { ReactNode } from "react";
import Link from "next/link";

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-2xl font-bold text-black sm:text-3xl">
      {children}
    </h2>
  );
}

function FeatureCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-black">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-700">{children}</div>
    </article>
  );
}

export function BusinessPage() {
  return (
    <main className="bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            For Business
          </p>
          <h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">
            Built for freelancers and growing teams
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-700">
            SmartOps Ledger brings invoicing, reporting, and automations into one
            workspace so you can run operations without juggling spreadsheets and
            disconnected tools.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/create-account"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Create account
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-black hover:border-primary/40"
            >
              View pricing
            </Link>
          </div>
        </header>

        <section className="mt-16 space-y-4">
          <SectionHeading id="freelancers">Freelancers</SectionHeading>
          <p className="text-base leading-relaxed text-neutral-700">
            Whether you bill clients by project, retainer, or milestone, SmartOps
            Ledger keeps your books organized from first invoice to final payout.
            Track what you have earned, what is outstanding, and what expenses
            belong to each client — without building your own system in a
            spreadsheet.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
            <li>Send professional invoices and follow up on unpaid balances</li>
            <li>Separate business expenses from personal spending</li>
            <li>See revenue and profit at a glance on your dashboard</li>
            <li>Stay subscription-ready with one account for your whole practice</li>
          </ul>
        </section>

        <section className="mt-16 space-y-6">
          <SectionHeading id="features">Features</SectionHeading>
          <p className="text-base leading-relaxed text-neutral-700">
            Core tools designed for day-to-day operational accounting — invoicing
            clients, understanding performance, and reducing repetitive work.
          </p>

          <div className="grid gap-6">
            <div id="invoicing" className="scroll-mt-24">
              <FeatureCard title="Invoicing">
                <p>
                  Create and send invoices from your dashboard, set due dates, and
                  track status from draft to paid. Connect payments so clients can
                  pay online and your records stay in sync.
                </p>
                <p>
                  Email invoices directly to clients and monitor overdue items so
                  nothing slips through during busy weeks.
                </p>
              </FeatureCard>
            </div>

            <div id="accounting-reports" className="scroll-mt-24">
              <FeatureCard title="Accounting reports">
                <p>
                  Revenue, expenses, and profit views give you a clear picture of
                  how the business is performing — without exporting data to
                  another tool first.
                </p>
                <p>
                  Use overview cards and dedicated report pages to review trends,
                  prepare for tax conversations, and make decisions based on
                  up-to-date numbers.
                </p>
              </FeatureCard>
            </div>

            <div id="automations" className="scroll-mt-24">
              <FeatureCard title="Automations">
                <p>
                  Reduce manual follow-up with workflows that help you stay on top
                  of recurring operational tasks — from invoice reminders to
                  routine record-keeping patterns your team relies on.
                </p>
                <p>
                  Automations are built to fit how you already work in SmartOps
                  Ledger, so you spend less time on admin and more time serving
                  clients.
                </p>
              </FeatureCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
