import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName } from "@/lib/auth";
import { getDashboardAccessStateByUserId } from "@/lib/access-control";
import { isDatabaseConnectionError } from "@/lib/db-connection-error";
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

  let session: { expires: Date; userId: string } | null;
  try {
    session = await prisma.session.findUnique({
      where: { sessionToken },
      select: {
        expires: true,
        userId: true,
      },
    });
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      redirect("/login?unavailable=1");
    }
    throw err;
  }

  if (!session || session.expires <= now) {
    redirect("/login");
  }

  let accessState: Awaited<ReturnType<typeof getDashboardAccessStateByUserId>>;
  try {
    accessState = await getDashboardAccessStateByUserId(session.userId);
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      redirect("/login?unavailable=1");
    }
    throw err;
  }
  if (!accessState) redirect("/login");

  let membership: Awaited<ReturnType<typeof getPrimaryOrganizationMembership>>;
  try {
    membership = await getPrimaryOrganizationMembership(session.userId);
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      redirect("/login?unavailable=1");
    }
    throw err;
  }

  if (requireOrganization && !membership) {
    redirect("/dashboard/organization");
  }

  return {
    userId: session.userId,
    accessState,
    membership,
  };
}
