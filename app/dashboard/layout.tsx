import { DashboardChrome } from "@/app/components/dashboard/dashboard-chrome";
import { requireDashboardUser } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { accessState, userId } = await requireDashboardUser({ requireOrganization: false });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  return (
    <DashboardChrome userEmail={user?.email ?? "Account"} isLocked={accessState.isLocked}>
      {children}
    </DashboardChrome>
  );
}
