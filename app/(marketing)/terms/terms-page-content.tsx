import Link from "next/link";
import type { ReactNode } from "react";

const EFFECTIVE_DATE = "June 10, 2026";

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-20 text-xl font-semibold text-neutral-900">
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-base leading-relaxed text-neutral-700">{children}</p>;
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-700">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TermsPageContent() {
  return (
    <main className="bg-white text-neutral-900">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="border-b border-neutral-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-sm text-neutral-600">
            Effective Date: {EFFECTIVE_DATE}
            <br />
            Last Updated: {EFFECTIVE_DATE}
          </p>
          <Paragraph>
            These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the
            SmartOps Ledger software platform (the &quot;Service&quot;) operated by SmartOps Ledger
            LLC (&quot;SmartOps Ledger,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
            By creating an account or using the Service, you agree to these Terms. If you do not
            agree, do not use the Service.
          </Paragraph>
        </header>

        <div className="mt-8">
          <SectionHeading id="overview">1. What SmartOps Ledger provides</SectionHeading>
          <Paragraph>
            SmartOps Ledger is an operational accounting workspace for freelancers and businesses.
            The Service helps you organize organizations, create and send invoices, record revenue
            and expenses, view reports, and manage related workflows from a single dashboard.
          </Paragraph>
          <Paragraph>
            SmartOps Ledger provides software tools only. We are not your accountant, tax adviser,
            payment institution, or legal counsel. You remain responsible for the accuracy of your
            records, compliance with applicable laws, and any professional advice you may need for
            your business.
          </Paragraph>

          <SectionHeading id="accounts">2. Accounts and organizations</SectionHeading>
          <Paragraph>
            You must provide accurate information when registering and keep your account credentials
            secure. You are responsible for all activity under your account.
          </Paragraph>
          <List
            items={[
              "You may create or join organizations within the limits of your plan.",
              "Organization owners and admins are responsible for inviting members and managing access.",
              "You must not share login credentials or use another person’s account without permission.",
              "Notify us promptly if you suspect unauthorized access to your account.",
            ]}
          />

          <SectionHeading id="subscriptions">3. Subscriptions and payments to SmartOps Ledger</SectionHeading>
          <Paragraph>
            Access to certain features requires an active paid subscription or eligible trial. Plan
            details and pricing are shown on our{" "}
            <Link href="/pricing" className="font-semibold text-primary hover:underline">
              Pricing
            </Link>{" "}
            page and in your dashboard.
          </Paragraph>
          <Paragraph>
            <strong className="text-neutral-900">
              Subscription payments to SmartOps Ledger are processed by Stripe.
            </strong>{" "}
            When you subscribe, you authorize Stripe to charge your selected payment method for
            recurring subscription fees according to the plan you choose. Billing terms, renewals,
            and cancellations are managed through your account and Stripe checkout or customer
            portal flows.
          </Paragraph>
          <Paragraph>
            <strong className="text-neutral-900">
              SmartOps Ledger does not charge, take, or receive any money from you other than fees
              for your paid subscription
            </strong>{" "}
            (and applicable taxes where required). We do not hold client funds, operate as a money
            transmitter for your invoice activity, or receive payments meant for your customers.
          </Paragraph>

          <SectionHeading id="invoices">4. Invoices and client payments</SectionHeading>
          <Paragraph>
            SmartOps Ledger allows you to create invoices and send them to your clients or customers
            (&quot;end clients&quot;). When you use invoicing or connected payment features:
          </Paragraph>
          <List
            items={[
              <>
                <strong className="text-neutral-900">Invoices are issued by you</strong>, not by
                SmartOps Ledger. You are the seller or service provider to your end client.
              </>,
              <>
                <strong className="text-neutral-900">
                  Payments on invoices are made to you (or your connected business account)
                </strong>
                , not to SmartOps Ledger. Funds from your end clients belong to you and are
                collected on your behalf through Stripe when you connect a Stripe account.
              </>,
              <>
                SmartOps Ledger facilitates sending invoice details and payment links; we are not
                a party to the commercial relationship between you and your end client.
              </>,
              <>
                You are responsible for invoice accuracy, pricing, taxes, refunds, disputes, and
                any obligations you owe to your end clients.
              </>,
            ]}
          />
          <Paragraph>
            Client invoice payments are also processed through{" "}
            <strong className="text-neutral-900">Stripe</strong> when you enable Stripe Connect in
            your dashboard settings. Stripe’s terms and privacy policy apply to those payment
            flows in addition to these Terms.
          </Paragraph>

          <SectionHeading id="acceptable-use">5. Acceptable use</SectionHeading>
          <Paragraph>You agree not to misuse the Service. For example, you must not:</Paragraph>
          <List
            items={[
              "Use the Service for unlawful, fraudulent, or deceptive purposes.",
              "Upload or transmit malware, spam, or harmful code.",
              "Attempt to access accounts or data that do not belong to you.",
              "Reverse engineer, scrape, or overload the Service in a way that harms availability.",
              "Misrepresent your identity, business, or authorization to invoice or collect payments.",
            ]}
          />

          <SectionHeading id="your-data">6. Your content and data</SectionHeading>
          <Paragraph>
            You retain ownership of the business data you enter into SmartOps Ledger, including
            client names, invoice details, and financial records. You grant us a limited license to
            host, process, and display that data solely to provide and improve the Service, as
            described in our{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </Paragraph>
          <Paragraph>
            You are responsible for maintaining backups or exports of your records where required
            for your business or legal obligations. We implement safeguards, but no online service
            can guarantee uninterrupted or loss-free operation.
          </Paragraph>

          <SectionHeading id="availability">7. Service availability and changes</SectionHeading>
          <Paragraph>
            We strive to keep SmartOps Ledger available and reliable. We may perform maintenance,
            updates, or changes to features, pricing, or these Terms from time to time. Where
            changes materially affect your use, we will make reasonable efforts to notify you
            through the Service or by email.
          </Paragraph>
          <Paragraph>
            Features shown in the dashboard — including invoicing, reporting, automations, and
            organization tools — may evolve. Trial access and plan limits may apply until you
            activate a paid subscription.
          </Paragraph>

          <SectionHeading id="third-parties">8. Third-party services</SectionHeading>
          <Paragraph>
            The Service integrates with third parties such as Stripe for subscription billing and,
            when you choose to connect them, for client invoice payments. Your use of third-party
            services is subject to their own terms and policies. SmartOps Ledger is not
            responsible for third-party outages, decisions, or actions outside our control.
          </Paragraph>

          <SectionHeading id="termination">9. Suspension and termination</SectionHeading>
          <Paragraph>
            You may stop using the Service at any time. We may suspend or terminate access if you
            violate these Terms, create risk for other users, or where required by law. Upon
            termination, your right to use the Service ends, but provisions that by nature should
            survive (such as payment obligations already incurred, disclaimers, and limitations of
            liability) will continue to apply.
          </Paragraph>

          <SectionHeading id="disclaimers">10. Disclaimers</SectionHeading>
          <Paragraph>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis to
            the fullest extent permitted by law. SmartOps Ledger disclaims warranties of
            merchantability, fitness for a particular purpose, and non-infringement. We do not
            warrant that the Service will be error-free, uninterrupted, or meet every business
            requirement you may have.
          </Paragraph>

          <SectionHeading id="liability">11. Limitation of liability</SectionHeading>
          <Paragraph>
            To the fullest extent permitted by law, SmartOps Ledger and its affiliates will not be
            liable for indirect, incidental, special, consequential, or punitive damages, or for
            lost profits, revenue, data, or business opportunities arising from your use of the
            Service. Our total liability for claims relating to the Service is limited to the
            amount you paid to SmartOps Ledger for the subscription in the twelve (12) months before
            the event giving rise to the claim.
          </Paragraph>

          <SectionHeading id="indemnity">12. Indemnity</SectionHeading>
          <Paragraph>
            You agree to indemnify and hold harmless SmartOps Ledger from claims, damages, and
            expenses (including reasonable legal fees) arising from your use of the Service, your
            invoices or client relationships, your violation of these Terms, or your violation of
            applicable law.
          </Paragraph>

          <SectionHeading id="governing-law">13. Governing law and contact</SectionHeading>
          <Paragraph>
            These Terms are governed by the laws applicable to SmartOps Ledger LLC, without regard
            to conflict-of-law principles. Questions about these Terms may be sent to{" "}
            <a
              href="mailto:support@smartopsledger.com"
              className="font-semibold text-primary hover:underline"
            >
              support@smartopsledger.com
            </a>
            . For product help, visit our{" "}
            <Link href="/getting-started" className="font-semibold text-primary hover:underline">
              Getting started
            </Link>{" "}
            guide or contact us on WhatsApp from the same page.
          </Paragraph>

          <SectionHeading id="changes">14. Changes to these Terms</SectionHeading>
          <Paragraph>
            We may update these Terms from time to time. The &quot;Last Updated&quot; date at the
            top of this page will reflect the latest version. Continued use of the Service after
            changes become effective constitutes acceptance of the revised Terms.
          </Paragraph>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="text-sm font-semibold text-neutral-900">Summary</p>
            <List
              items={[
                "Subscription fees are paid to SmartOps Ledger through Stripe.",
                "Invoice payments from your clients are paid to you, not to SmartOps Ledger.",
                "SmartOps Ledger only receives money from your paid subscription.",
                "You are responsible for your invoices, client relationships, and business compliance.",
              ]}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
