import { AuthForm } from "@/app/components/auth/auth-form";
import { AuthShell } from "@/app/components/auth/auth-shell";

export default function CreateAccountPage() {
  return (
    <AuthShell
      title="Start building with confidence"
      subtitle="Create your SmartOps Ledger account and manage your business operations from one secure and simple workspace."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
