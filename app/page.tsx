import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  BarChart3,
  ReceiptText,
  CreditCard,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

const quickMenu = [
  { label: "Start Free Trial", href: "/create-account", primary: true },
  { label: "View Pricing", href: "/pricing" },
  { label: "See Dashboard Preview", href: "/dashboard" },
];

const features = [
  {
    title: "Smart Invoicing",
    description:
      "Create invoices quickly and keep status updates synced with your billing flow.",
    icon: ReceiptText,
  },
  {
    title: "Automated Follow-ups",
    description:
      "Reduce manual chasing with event-driven reminders and cleaner payment collection.",
    icon: Zap,
  },
  {
    title: "Payment + Subscription Sync",
    description:
      "Keep Stripe customers, plans, and subscriptions linked to internal users reliably.",
    icon: CreditCard,
  },
  {
    title: "Live Business Visibility",
    description:
      "Track revenue and operational metrics in one place so decisions are made faster.",
    icon: BarChart3,
  },
];

const pricingPreview = [
  {
    name: "Premium",
    price: "$10",
    interval: "/month",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$100",
    interval: "/year",
    highlight: true,
  },
];

export default function HomePage() {
  return (
    <div className="pb-16">
      <section className="mx-auto mt-4 grid w-full max-w-6xl gap-10 rounded-3xl border border-border bg-secondary px-4 py-12 text-white shadow-2xl shadow-black/20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-18">
        <div>
          <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Smart operations platform
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Automate operations and get paid faster.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">
            SmartOps Ledger helps businesses send invoices, sync subscription
            billing with Stripe, and stay on top of operations without extra
            manual work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {quickMenu.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  size="lg"
                  variant={item.primary ? "default" : "outline"}
                  className={
                    item.primary
                      ? ""
                      : "border-white/70 bg-transparent text-white hover:bg-white/10"
                  }
                >
                  {item.label}
                  {item.primary ? <ArrowRight className="h-4 w-4" /> : null}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-primary/20 bg-white p-6 shadow-2xl shadow-primary/20">
          <Image
            src="/smartops_logo.png"
            alt="SmartOps Ledger logo"
            width={460}
            height={320}
            className="mx-auto h-auto w-full max-w-sm"
            priority
          />
          <div className="mt-6 grid gap-3 rounded-2xl bg-black p-4 text-sm">
            <p className="font-semibold text-white">Business-ready from day one</p>
            <p className="text-white/80">- Fast onboarding for teams</p>
            <p className="text-white/80">- Secure login and account control</p>
            <p className="text-white/80">- Clear financial and operational history</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-md shadow-black/5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="inline-flex rounded-xl bg-primary/15 p-2 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-foreground">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-md shadow-black/5 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Start with a plan that matches your stage and scale as your
                operations grow.
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="ghost" className="text-primary">
                Compare all plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pricingPreview.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-5 ${
                  plan.highlight
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {plan.interval}
                  </span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Includes core billing automation and Stripe sync.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl border border-primary/30 bg-primary p-7 text-white sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to automate your business?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Join teams that use SmartOps Ledger to keep billing, customer data,
            and operations aligned in one secure workflow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/create-account">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-white/90"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
