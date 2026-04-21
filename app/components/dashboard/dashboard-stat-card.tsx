import type { LucideIcon } from "lucide-react";
import { Lock } from "lucide-react";
import Link from "next/link";

type DashboardStatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  href: string;
  locked?: boolean;
};

export function DashboardStatCard({
  title,
  value,
  detail,
  icon: Icon,
  href,
  locked = false,
}: DashboardStatCardProps) {
  const destination = locked ? "/pricing" : href;

  return (
    <Link href={destination}>
      <article className="rounded-2xl border border-border bg-white p-4 shadow-sm transition-colors hover:border-primary/40">
        <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-600">
          {title}
          {locked ? <Lock className="h-3.5 w-3.5 text-zinc-500" /> : null}
        </p>
        <p className="mt-1 text-2xl font-bold text-black">{value}</p>
        <p className="mt-2 text-xs text-zinc-500">{detail}</p>
      </article>
    </Link>
  );
}
