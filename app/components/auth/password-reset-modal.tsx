"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { AuthInput } from "@/app/components/auth/auth-input";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^\d{6}$/;

type Props = {
  open: boolean;
  onClose: () => void;
};

type Step = "request" | "verify";

export function PasswordResetModal({ open, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const resetState = () => {
    setStep("request");
    setEmail("");
    setOtp("");
    setLoading(false);
    setFeedback("");
    setError("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const normalizedEmail = email.trim().toLowerCase();

  const requestOtp = async () => {
    setError("");
    setFeedback("");
    if (!emailRegex.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!res.ok) {
        setError("Could not send OTP right now. Please try again.");
        return;
      }

      setFeedback("If the email is registered, an OTP has been sent.");
      setStep("verify");
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setFeedback("");

    if (!otpRegex.test(otp.trim())) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: otp.trim(),
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string; resetToken?: string }
        | null;
      if (!res.ok) {
        if (data?.error === "INVALID_OR_EXPIRED_OTP") {
          setError("Invalid or expired OTP. Request a new code and retry.");
        } else {
          setError("Could not verify OTP. Please try again.");
        }
        return;
      }

      if (!data?.resetToken) {
        setError("Verification succeeded, but reset session could not be created.");
        return;
      }

      handleClose();
      router.push(`/change-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-foreground">Reset password</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "request"
            ? "Enter your registered business email to receive a one-time code."
            : "Enter the 6-digit OTP sent to your email to continue."}
        </p>

        <div className="mt-5 space-y-4">
          <AuthInput
            label="Business email"
            name="reset-email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            autoComplete="email"
            maxLength={254}
          />

          {step === "verify" ? (
            <AuthInput
              label="OTP code"
              name="reset-otp"
              type="text"
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              autoComplete="one-time-code"
              maxLength={6}
            />
          ) : null}

          {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" type="button" onClick={handleClose}>
            Cancel
          </Button>
          {step === "request" ? (
            <Button size="sm" type="button" onClick={requestOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <Button size="sm" type="button" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
