import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const features = [
  {
    title: "Live business visibility",
    description:
      "Track revenue, invoices, and expense flows from one smart operational ledger.",
    icon: BarChart3,
  },
  {
    title: "Secure by default",
    description:
      "Session-based access and encrypted credentials keep your accounting workflow protected.",
    icon: ShieldCheck,
  },
  {
    title: "Automated operations",
    description:
      "Reduce manual follow-ups with event-driven invoicing and payment updates.",
    icon: Zap,
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
            The modern ledger for businesses that run fast.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">
            SmartOps Ledger helps teams manage daily operations, billing, and
            decisions with clarity. From early-stage startups to scaling
            businesses, your numbers stay reliable and accessible.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/create-account">
              <Button size="lg">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Log in
              </Button>
            </Link>
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

      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-3">
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
        <div className="rounded-3xl border border-primary/30 bg-primary p-7 text-white sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Run operations with confidence.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Build your account, centralize your records, and give your team a
            secure system designed for modern business execution.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/create-account">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-white/90"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-white/70 bg-transparent text-white hover:bg-white/10"
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
