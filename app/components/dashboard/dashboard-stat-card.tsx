import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function DashboardStatCard({
  title,
  value,
  detail,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-black">{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{detail}</p>
    </article>
  );
}
