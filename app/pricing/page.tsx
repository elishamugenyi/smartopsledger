//import this from components/PricingPage.tsx
import { PricingPage } from "@/app/components/PricingPage";
import billingConfig from "@/billing.config";

export default function Pricing() {
    const plans = billingConfig.test?.plans || [];
  return <PricingPage plans={plans} currentPlanId="free" />;
}