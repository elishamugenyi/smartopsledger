import { cookies } from "next/headers";
import { PricingPage } from "@/app/components/PricingPage";
import billingConfig from "@/billing.config";
import { getSessionCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Pricing() {
  const plans = billingConfig.test?.plans || [];
  const token = (await cookies()).get(getSessionCookieName())?.value;
  let accountEmail: string | undefined;
  if (token) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        select: { expires: true, user: { select: { email: true } } },
      });
      if (session && session.expires > new Date()) {
        accountEmail = session.user.email;
      }
    } catch {
      // Unreachable DB: still render pricing without personalized email.
    }
  }

  return (
    <PricingPage plans={plans} currentPlanId="free" accountEmail={accountEmail} />
  );
}
