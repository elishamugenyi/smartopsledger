import { requireDashboardUser } from "@/lib/dashboard-access";

export default async function AutomationPage() {
  await requireDashboardUser();

  return (
    <div className="p-4 sm:p-6">
      <main className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Automation</h1>
        <p className="mt-2 text-sm text-zinc-600">
          This page is free for all users. You will automate business data and
          operations here in the next phase.
        </p>
      </main>
    </div>
  );
}
