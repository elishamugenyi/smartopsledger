import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName } from "@/lib/auth";
import { getDashboardAccessStateByUserId } from "@/lib/access-control";
import { getPrimaryOrganizationMembership } from "@/lib/organization";
import { prisma } from "@/lib/prisma";

type RequireDashboardUserOptions = {
  requireOrganization?: boolean;
};

export async function requireDashboardUser(
  options: RequireDashboardUserOptions = {},
) {
  const requireOrganization = options.requireOrganization ?? true;
  const now = new Date();
  const sessionToken = (await cookies()).get(getSessionCookieName())?.value;

  if (!sessionToken) redirect("/login");

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    select: {
      expires: true,
      userId: true,
    },
  });

  if (!session || session.expires <= now) {
    redirect("/login");
  }

  const accessState = await getDashboardAccessStateByUserId(session.userId);
  if (!accessState) redirect("/login");
  const membership = await getPrimaryOrganizationMembership(session.userId);

  if (requireOrganization && !membership) {
    redirect("/dashboard/organization");
  }

  return {
    userId: session.userId,
    accessState,
    membership,
  };
}
