import { AuthForm } from "@/app/components/auth/auth-form";
import { AuthShell } from "@/app/components/auth/auth-shell";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ unavailable?: string }>;
}) {
  const sp = await searchParams;
  const serviceNotice =
    sp.unavailable === "1"
      ? "We could not reach our servers. Check your internet connection and try again in a few minutes."
      : undefined;

  return (
    <AuthShell
      title="Log in to SmartOps Ledger"
      subtitle="Access your secure business workspace to track operations, monitor growth, and keep records organized."
    >
      <AuthForm mode="login" serviceNotice={serviceNotice} />
    </AuthShell>
  );
}
