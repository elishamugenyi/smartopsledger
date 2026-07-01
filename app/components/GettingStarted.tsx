import type { ReactNode } from "react";
import Link from "next/link";
import { GettingStartedFaq } from "@/app/components/getting-started-faq";

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold text-black sm:text-2xl">
      {children}
    </h2>
  );
}

function TutorialStep({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Step {step}
      </p>
      <h3 className="mt-1 text-lg font-bold text-black">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-700">{children}</div>
    </article>
  );
}

export function GettingStartedPage() {
  return (
    <main className="bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header id="getting-started" className="scroll-mt-24 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Learn &amp; Support
          </p>
          <h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">
            Getting started
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-700">
            New to SmartOps Ledger? Follow these guides to set up your account,
            choose a plan, and start using your dashboard.
          </p>
        </header>

        <section className="mt-12 space-y-6">
          <TutorialStep step={1} title="Create your account">
            <p>
              Go to{" "}
              <Link href="/create-account" className="font-semibold text-primary hover:underline">
                Create account
              </Link>{" "}
              and register with your business email and a secure password. You can
              also sign up with Google if that option is enabled on the form.
            </p>
            <p>
              After registration you are signed in automatically and can access
              your dashboard to set up your organization.
            </p>
          </TutorialStep>

          <TutorialStep step={2} title="Log in">
            <p>
              Return anytime via{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
              . Enter the email and password you used when registering.
            </p>
            <p>
              If you forget your password, use the forgot-password option on the login
              page to receive a one-time code by email.
            </p>
          </TutorialStep>

          <TutorialStep step={3} title="Pay for a subscription">
            <p>
              Visit the{" "}
              <Link href="/pricing" className="font-semibold text-primary hover:underline">
                Pricing
              </Link>{" "}
              page while logged in and choose the plan that fits your business.
              Checkout is handled securely through Stripe.
            </p>
            <p>
              After payment, your subscription unlocks full dashboard access for
              your organization. You can manage billing from Settings in your
              dashboard.
            </p>
          </TutorialStep>

          <TutorialStep step={4} title="Use features on the dashboard">
            <p>From your dashboard you can:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-black">Overview</strong> — see revenue,
                invoices, and key metrics at a glance
              </li>
              <li>
                <strong className="text-black">Invoices</strong> — create, send,
                and track client invoices
              </li>
              <li>
                <strong className="text-black">Revenue &amp; expenses</strong> —
                record income and spending for accurate reports
              </li>
              <li>
                <strong className="text-black">Profit &amp; taxes</strong> —
                review performance and tax-related snapshots
              </li>
              <li>
                <strong className="text-black">Automations</strong> — set up
                workflows that reduce repetitive tasks
              </li>
              <li>
                <strong className="text-black">Organization</strong> — invite
                team members and manage access
              </li>
            </ul>
            <p>
              Explore each section from the sidebar after you log in. Trial access
              may apply until you activate a paid plan.
            </p>
          </TutorialStep>
        </section>

        <section
          id="chat-support"
          className="mt-16 scroll-mt-24 rounded-2xl border border-border bg-neutral-50 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-black sm:text-2xl">Chat support</h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-700">
            Need help? Reach our team by WhatsApp or email. We typically respond
            within one business day.
          </p>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-bold text-black">WhatsApp</dt>
              <dd className="mt-2 text-sm text-neutral-700">
                <a
                  href="https://wa.me/+256787019408"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Chat on WhatsApp
                </a>
                <p className="mt-1 text-neutral-600">
                  Use our WhatsApp number for a quicker response.
                </p>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-bold text-black">Email</dt>
              <dd className="mt-2 text-sm text-neutral-700">
                <a
                  href="mailto:support@smartopsledger.com"
                  className="font-semibold text-primary hover:underline"
                >
                  support@smartopsledger.com
                </a>
                <p className="mt-1 text-neutral-600">
                  Include your account email and a short description of the issue.
                </p>
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-sm text-neutral-600">
            Logged-in users can also open{" "}
            <Link href="/dashboard/support" className="font-semibold text-primary hover:underline">
              Support in the dashboard
            </Link>{" "}
            to submit a ticket.
          </p>
        </section>

        <GettingStartedFaq />
      </div>
    </main>
  );
}
