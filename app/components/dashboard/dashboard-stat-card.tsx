import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CardTone = "primary" | "success" | "danger" | "warning" | "neutral";

type DashboardStatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  href: string;
  locked?: boolean;
  tone?: CardTone;
};

const toneStyles: Record<
  CardTone,
  { icon: string; value: string; border: string; hover: string }
> = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
    border: "border-border",
    hover: "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
  },
  success: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200/70 dark:border-emerald-900/40",
    hover: "hover:border-emerald-400/50 hover:shadow-md hover:shadow-emerald-500/5",
  },
  danger: {
    icon: "bg-red-500/10 text-red-600 dark:text-red-400",
    value: "text-red-700 dark:text-red-400",
    border: "border-red-200/70 dark:border-red-900/40",
    hover: "hover:border-red-400/50 hover:shadow-md hover:shadow-red-500/5",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200/70 dark:border-amber-900/40",
    hover: "hover:border-amber-400/50 hover:shadow-md hover:shadow-amber-500/5",
  },
  neutral: {
    icon: "bg-muted text-foreground",
    value: "text-foreground",
    border: "border-border",
    hover: "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
  },
};

export function DashboardStatCard({
  title,
  value,
  detail,
  icon: Icon,
  href,
  locked = false,
  tone = "primary",
}: DashboardStatCardProps) {
  const destination = locked ? "/pricing" : href;
  const styles = toneStyles[tone];

  return (
    <Link href={destination} className="group block h-full">
      <article
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition-all sm:p-5",
          styles.border,
          styles.hover,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className={cn("inline-flex rounded-xl p-2.5", styles.icon)}>
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {title}
          {locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden /> : null}
        </p>
        <p className={cn("mt-1 text-2xl font-bold tracking-tight sm:text-3xl", styles.value)}>
          {value}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </article>
    </Link>
  );
}
