import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:py-16">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-secondary/20 lg:min-h-[620px]">
        <div className="flex min-h-[260px] items-center justify-center bg-white p-8">
          <Image
            src="/smartops_joined.png"
            alt="SmartOps Ledger"
            width={600}
            height={329}
            className="h-auto w-full max-w-sm"
          />
        </div>
        <div className="h-full bg-secondary p-8 text-white">
          <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">{subtitle}</p>
          <div className="mt-8 grid gap-3 text-sm text-white/90">
            <p>• End-to-end operational tracking</p>
            <p>• Secure account sessions</p>
            <p>• Built for growing teams</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8 lg:min-h-[620px]">
        {children}
      </div>
    </section>
  );
}
