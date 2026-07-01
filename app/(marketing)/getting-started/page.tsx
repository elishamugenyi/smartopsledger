import type { Metadata } from "next";
import { GettingStartedPage } from "@/app/components/GettingStarted";

export const metadata: Metadata = {
  title: "Getting Started | SmartOps Ledger",
  description:
    "Learn how to create an account, log in, subscribe, and use SmartOps Ledger — plus WhatsApp and email support.",
};

export default function GettingStartedRoutePage() {
  return <GettingStartedPage />;
}
