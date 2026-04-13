import { AuthForm } from "@/app/components/auth/auth-form";
import { AuthShell } from "@/app/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Log in to SmartOps Ledger"
      subtitle="Access your secure business workspace to track operations, monitor growth, and keep records organized."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
