"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthInput } from "@/app/components/auth/auth-input";
import { Button } from "@/app/components/ui/button";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token")?.trim() ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (loading || !resetToken) return false;
    if (!passwordRegex.test(newPassword)) return false;
    if (newPassword !== confirmPassword) return false;
    return true;
  }, [loading, resetToken, newPassword, confirmPassword]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!resetToken) {
      setError("Invalid reset link. Restart reset from login.");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be 8-72 chars and include uppercase, lowercase, and a number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        if (data?.error === "INVALID_OR_EXPIRED_RESET_TOKEN") {
          setError("Your reset session expired. Please request a new OTP from login.");
        } else if (data?.error === "INVALID_OR_EXPIRED_OTP") {
          setError("The OTP is no longer valid. Please request a new OTP.");
        } else if (data?.error === "PASSWORD_MIN_8_CHARS") {
          setError("Password must be at least 8 characters.");
        } else {
          setError("Unable to update password now. Please try again.");
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthShell
        title="Set a new password"
        subtitle="For security, start from the login page and complete OTP verification first."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Missing or invalid reset email. Start reset from login.
          </p>
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set your new password"
      subtitle="Use a strong password to keep your SmartOps Ledger account secure."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthInput
          label="New password"
          name="new-password"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Create a strong password"
          autoComplete="new-password"
          maxLength={72}
        />

        <AuthInput
          label="Confirm password"
          name="confirm-password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          maxLength={72}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {showPassword ? "Hide passwords" : "Show passwords"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
