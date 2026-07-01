import type { Metadata } from "next";
import { PrivacyPolicyContent } from "./privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | SmartOps Ledger",
  description:
    "Privacy Notice for SmartOps Ledger — how we collect, use, disclose, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-neutral-900">
      <PrivacyPolicyContent />
    </main>
  );
}
