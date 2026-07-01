"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "organization-setup",
    question: "How do I set up my first organization?",
    answer: (
      <>
        <p>
          After you{" "}
          <Link href="/create-account" className="font-semibold text-primary hover:underline">
            create an account
          </Link>
          , open your dashboard and go to <strong>Organization</strong>. Enter your
          business name and save — that creates the workspace where invoices, revenue,
          expenses, and team members live.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Log in → sidebar → Organization → fill
          in your business details → save. You can update the name later from the same
          page.
        </p>
      </>
    ),
  },
  {
    id: "subscription-access",
    question: "Who needs a paid subscription in my organization?",
    answer: (
      <>
        <p>
          Subscription access is tied to the account that pays for the plan. When that
          account has an active subscription (or trial), organization members can use
          protected dashboard features according to your plan.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> The organization owner or admin should
          visit{" "}
          <Link href="/pricing" className="font-semibold text-primary hover:underline">
            Pricing
          </Link>
          , choose a plan, and complete checkout. Manage billing anytime from{" "}
          <strong>Settings</strong> in the dashboard.
        </p>
      </>
    ),
  },
  {
    id: "free-trial",
    question: "How does the SmartOps Ledger trial work?",
    answer: (
      <>
        <p>
          New accounts may receive a trial period to explore the dashboard before
          subscribing. During the trial you can use core modules; when the trial ends,
          a paid plan is required to keep full access to protected features.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Check your trial status on the dashboard
          overview. Before it expires, go to Pricing and subscribe so your team is not
          interrupted.
        </p>
      </>
    ),
  },
  {
    id: "create-invoice",
    question: "How do I create and send an invoice to a client?",
    answer: (
      <>
        <p>
          Open <strong>Invoices</strong> from the dashboard sidebar. Create a new
          invoice with the client name, amount, due date, and line items. You can save
          as draft, mark sent, or email the invoice directly to your client from
          SmartOps Ledger.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Dashboard → Invoices → create invoice →
          enter client details → set status → use Send to deliver it by email. Track
          paid and overdue invoices from the same list.
        </p>
      </>
    ),
  },
  {
    id: "stripe-connect",
    question: "How do I accept online payments on invoices?",
    answer: (
      <>
        <p>
          SmartOps Ledger uses Stripe Connect so client payments go to your connected
          account. Connect once under{" "}
          <strong>Settings → Payments</strong>, complete Stripe onboarding, then payment
          links can be included when you send invoices.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Dashboard → Settings → Payments →
          Connect with Stripe → follow the onboarding steps. After your account is
          active, new invoices can include a pay-online link for clients.
        </p>
      </>
    ),
  },
  {
    id: "revenue-vs-expenses",
    question: "What is the difference between Revenue and Expenses?",
    answer: (
      <>
        <p>
          <strong>Revenue</strong> records money coming into the business (sales,
          client payments, service income). <strong>Expenses</strong> records money
          going out (supplies, software, travel, contractor costs). Keeping them
          separate gives accurate profit and tax snapshots.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Use Revenue and Expenses in the sidebar
          to add entries with dates and amounts. Review combined results on{" "}
          <strong>Profit &amp; taxes</strong> and the dashboard overview.
        </p>
      </>
    ),
  },
  {
    id: "invite-members",
    question: "How do I invite team members to my organization?",
    answer: (
      <>
        <p>
          Each organization can include an admin plus up to two members with the Member
          role. The person you invite must already have a SmartOps Ledger account —
          add them by email from the Organization page.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Dashboard → Organization → Add member →
          enter their registered email → assign Admin or Member role → save. They will
          see the organization when they log in.
        </p>
      </>
    ),
  },
  {
    id: "password-reset",
    question: "I forgot my password. How do I get back into my account?",
    answer: (
      <>
        <p>
          On the{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            login page
          </Link>
          , choose the forgot-password option. Enter your registered email and you will
          receive a one-time code (OTP) by email to verify your identity and set a new
          password.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Login → Forgot password → enter email →
          check inbox for OTP → enter code → choose a new secure password → log in
          again.
        </p>
      </>
    ),
  },
  {
    id: "automations",
    question: "What are Automations in SmartOps Ledger?",
    answer: (
      <>
        <p>
          Automations help reduce repetitive operational work — such as staying on top of
          invoice follow-ups and routine bookkeeping patterns — so you spend less time
          on admin and more on your business.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Open <strong>Automations</strong> from
          the dashboard sidebar, review available workflows, and enable the ones that
          match how you run your practice. Requires an active subscription or trial.
        </p>
      </>
    ),
  },
  {
    id: "multiple-organizations",
    question: "Can I manage more than one business on SmartOps Ledger?",
    answer: (
      <>
        <p>
          Yes. A single account can own up to two organizations — useful if you run a
          freelance practice and a separate venture, or manage distinct client entities.
        </p>
        <p className="mt-3">
          <strong>How to go about it:</strong> Dashboard → Organization → create a new
          organization if you are under the limit. Switch context from the organization
          settings or selector when working in each workspace.
        </p>
      </>
    ),
  },
];

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;
  const buttonId = `faq-button-${item.id}`;

  return (
    <article
      className={`overflow-hidden rounded-xl border transition-colors ${
        isOpen
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-white hover:border-primary/40"
      }`}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-4 px-5 py-4 text-left"
        >
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
              isOpen
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}
            aria-hidden
          >
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </span>
          <span
            className={`flex-1 text-base font-bold leading-snug ${
              isOpen ? "text-primary" : "text-black"
            }`}
          >
            {item.question}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="border-t border-primary/20 px-5 pb-5 pt-4 text-sm leading-relaxed text-neutral-700"
      >
        {item.answer}
      </div>
    </article>
  );
}

export function GettingStartedFaq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faqs"
      className="mt-16 scroll-mt-24 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Help center
      </p>
      <h2 className="mt-1 text-xl font-bold text-black sm:text-2xl">
        Frequently asked questions
      </h2>
      <p className="mt-3 text-base leading-relaxed text-neutral-700">
        Quick answers about SmartOps Ledger. Click the{" "}
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 align-middle text-primary">
          <Plus className="h-3 w-3" />
        </span>{" "}
        icon on any question to read the full answer and steps.
      </p>

      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item) => (
          <FaqAccordionItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>
    </section>
  );
}
