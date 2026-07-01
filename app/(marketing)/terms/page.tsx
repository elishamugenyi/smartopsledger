import type { Metadata } from "next";
import { TermsPageContent } from "./terms-page-content";

export const metadata: Metadata = {
  title: "Terms and Conditions | SmartOps Ledger",
  description: "Terms and conditions for using SmartOps Ledger.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
