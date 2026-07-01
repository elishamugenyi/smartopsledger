import type { Metadata } from "next";
import { BusinessPage } from "@/app/components/business";

export const metadata: Metadata = {
  title: "For Business | SmartOps Ledger",
  description:
    "SmartOps Ledger for freelancers — invoicing, accounting reports, and automations in one operational workspace.",
};

export default function BusinessRoutePage() {
  return <BusinessPage />;
}
