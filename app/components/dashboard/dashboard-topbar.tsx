type DashboardTopbarProps = {
  title: string;
};

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 sm:px-6">
      <p className="text-sm font-semibold tracking-wide">{title}</p>
    </div>
  );
}
