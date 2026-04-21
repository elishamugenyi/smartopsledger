import { DashboardHamburgerMenu } from "@/app/components/dashboard/dashboard-hamburger-menu";

type DashboardTopbarProps = {
  title: string;
};

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  return (
    <div className="border border-primary/20 bg-primary px-5 py-3 text-white shadow-lg shadow-primary/20 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold tracking-wide">{title}</p>
        <DashboardHamburgerMenu />
      </div>
    </div>
  );
}
