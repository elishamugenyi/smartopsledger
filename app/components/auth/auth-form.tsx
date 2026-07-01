"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { AuthInput } from "@/app/components/auth/auth-input";
import { PasswordResetModal } from "@/app/components/auth/password-reset-modal";
import {
  CLIENT_LOGIN_FAILURE_LOCKOUT_AFTER,
  CLIENT_LOGIN_LOCKOUT_MS,
  CLIENT_LOGIN_MIN_INTERVAL_MS,
} from "@/lib/auth-form-login-limits";

type Mode = "register" | "login";

type Props = {
  mode: Mode;
  /** Shown when redirected from dashboard due to unreachable database, etc. */
  serviceNotice?: string;
};

type AccountType = "freelancer" | "business";

type FormState = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  confirmPassword?: string;
  accountType?: string;
};

function passwordsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

type AuthResponseJson = {
  error?: string;
  hint?: string;
  retryAfterSec?: number;
};

export function AuthForm({ mode, serviceNotice }: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ name: "", email: "", password: "" });
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const lastLoginSubmitAt = useRef(0);
  const loginConsecutiveFailures = useRef(0);
  const [loginClientLockoutUntil, setLoginClientLockoutUntil] = useState(0);

  const isRegister = mode === "register";

  const heading = isRegister ? "Create your SmartOps account" : "Welcome back";
  const subHeading = isRegister
    ? "Set up your secure workspace in minutes."
    : "Log in to continue managing operations and ledgers.";

  const validate = (
    value: FormState,
    options?: { confirm?: string; type?: AccountType | null },
  ): FormErrors => {
    const next: FormErrors = {};

    if (isRegister) {
      const type = options?.type ?? accountType;
      if (!type) {
        next.accountType = "Choose whether you are signing up as a freelancer or business.";
      } else {
        const cleanName = value.name.trim();
        const nameLabel = type === "freelancer" ? "Full name" : "Business name";
        if (!cleanName) next.name = `${nameLabel} is required.`;
        else if (cleanName.length < 2) next.name = "Use at least 2 characters.";
        else if (cleanName.length > 80) next.name = "Name is too long.";
      }

      const confirm = options?.confirm ?? confirmPassword;
      if (!confirm) {
        next.confirmPassword = "Confirm your password.";
      } else if (!passwordsMatch(value.password, confirm)) {
        next.confirmPassword = "Passwords do not match.";
      }
    }

    const email = value.email.trim().toLowerCase();
    if (!email) next.email = "Email is required.";
    else if (!emailRegex.test(email)) next.email = "Enter a valid business email.";

    if (!value.password) next.password = "Password is required.";
    else if (!passwordRegex.test(value.password)) {
      next.password = "8-72 chars, with uppercase, lowercase, and a number.";
    }

    return next;
  };

  const validationErrors = validate(state);
  const canSubmit =
    !loading &&
    Object.keys(validationErrors).length === 0 &&
    (!isRegister || termsAccepted);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    if (isRegister && !termsAccepted) return;

    const nextErrors = validate(state, { confirm: confirmPassword, type: accountType });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!isRegister) {
      const now = Date.now();
      if (loginClientLockoutUntil > now) {
        const waitSec = Math.ceil((loginClientLockoutUntil - now) / 1000);
        setServerError(`Please wait ${waitSec}s before trying to log in again.`);
        return;
      }
      if (
        lastLoginSubmitAt.current > 0 &&
        now - lastLoginSubmitAt.current < CLIENT_LOGIN_MIN_INTERVAL_MS
      ) {
        const waitMs = CLIENT_LOGIN_MIN_INTERVAL_MS - (now - lastLoginSubmitAt.current);
        setServerError(`Please wait ${Math.ceil(waitMs / 1000)}s between login attempts.`);
        return;
      }
      lastLoginSubmitAt.current = now;
    }

    setLoading(true);

    try {
      const payload = isRegister
        ? {
            name: state.name.trim(),
            email: state.email.trim().toLowerCase(),
            password: state.password,
          }
        : {
            email: state.email.trim().toLowerCase(),
            password: state.password,
          };

      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as AuthResponseJson | null;

      if (!res.ok) {
        const code = data?.error ?? "AUTH_FAILED";
        const hint = data?.hint;
        const retryHeader = res.headers.get("retry-after");
        const retryFromHeader = retryHeader ? Number.parseInt(retryHeader, 10) : NaN;
        const retryAfterSec = Number.isFinite(retryFromHeader)
          ? retryFromHeader
          : typeof data?.retryAfterSec === "number"
            ? data.retryAfterSec
            : 60;

        if (!isRegister && code === "RATE_LIMITED") {
          setServerError(hint ?? "Too many login attempts. Please wait and try again.");
          setLoginClientLockoutUntil(Date.now() + retryAfterSec * 1000);
          return;
        }
        if (code === "DATABASE_UNAVAILABLE") {
          setServerError(
            hint ??
              "We cannot reach our servers. Check your internet connection and try again shortly.",
          );
          return;
        }
        if (code === "EMAIL_ALREADY_EXISTS") {
          setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
        } else if (!isRegister && code === "INVALID_CREDENTIALS") {
          setServerError("Invalid email or password.");
          loginConsecutiveFailures.current += 1;
          if (loginConsecutiveFailures.current >= CLIENT_LOGIN_FAILURE_LOCKOUT_AFTER) {
            loginConsecutiveFailures.current = 0;
            setLoginClientLockoutUntil(Date.now() + CLIENT_LOGIN_LOCKOUT_MS);
          }
        } else if (code === "PASSWORD_MIN_8_CHARS") {
          setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
        } else {
          setServerError(hint ?? "Unable to continue right now. Please try again.");
        }
        return;
      }

      if (!isRegister) {
        loginConsecutiveFailures.current = 0;
        setLoginClientLockoutUntil(0);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Network error. Please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{subHeading}</p>

      {serviceNotice ? (
        <p
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          role="status"
        >
          {serviceNotice}
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {isRegister ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Account type</legend>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="radio"
                  name="accountType"
                  value="freelancer"
                  checked={accountType === "freelancer"}
                  onChange={() => {
                    setAccountType("freelancer");
                    setState((prev) => ({ ...prev, name: "" }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.accountType;
                      delete next.name;
                      return next;
                    });
                  }}
                  className="h-4 w-4 accent-primary"
                />
                For Freelancers
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="radio"
                  name="accountType"
                  value="business"
                  checked={accountType === "business"}
                  onChange={() => {
                    setAccountType("business");
                    setState((prev) => ({ ...prev, name: "" }));
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.accountType;
                      delete next.name;
                      return next;
                    });
                  }}
                  className="h-4 w-4 accent-primary"
                />
                For Business
              </label>
            </div>
            {errors.accountType ? (
              <p className="text-xs text-red-600">{errors.accountType}</p>
            ) : null}
          </fieldset>
        ) : null}

        {isRegister && accountType ? (
          <AuthInput
            label={accountType === "freelancer" ? "Full name" : "Business name"}
            name="name"
            value={state.name}
            onChange={(value) => setState((prev) => ({ ...prev, name: value }))}
            placeholder={accountType === "freelancer" ? "Jane Doe" : "Acme Consulting Ltd."}
            autoComplete={accountType === "freelancer" ? "name" : "organization"}
            maxLength={80}
            error={errors.name}
          />
        ) : null}

        <AuthInput
          label="Work email"
          name="email"
          type="email"
          value={state.email}
          onChange={(value) => setState((prev) => ({ ...prev, email: value }))}
          placeholder="you@company.com"
          autoComplete="email"
          maxLength={254}
          error={errors.email}
        />

        <AuthInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={state.password}
          onChange={(value) => setState((prev) => ({ ...prev, password: value }))}
          placeholder={isRegister ? "Create a strong password" : "Enter your password"}
          autoComplete={isRegister ? "new-password" : "current-password"}
          maxLength={72}
          error={errors.password}
        />

        {isRegister ? (
          <AuthInput
            label="Confirm password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(value) => {
              setConfirmPassword(value);
              setErrors((prev) => {
                const next = { ...prev };
                delete next.confirmPassword;
                return next;
              });
            }}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            maxLength={72}
            error={errors.confirmPassword}
          />
        ) : null}

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="font-medium text-primary hover:underline"
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>
          {!isRegister ? (
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          ) : null}
        </div>

        {isRegister ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="text-sm leading-relaxed text-muted-foreground">
              By clicking this checkbox, you agree to{" "}
              <Link href="/terms" className="font-semibold text-primary hover:underline">
                terms and conditions
              </Link>
              . Our{" "}
              <Link href="/privacy" className="font-semibold text-primary hover:underline">
                privacy policy
              </Link>{" "}
              applies to your personal data.
            </span>
          </label>
        ) : null}

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        {isRegister ? "Already have an account?" : "Need a new account?"}{" "}
        <Link
          href={isRegister ? "/login" : "/create-account"}
          className="font-semibold text-primary hover:underline"
        >
          {isRegister ? "Log in" : "Create account"}
        </Link>
      </p>
      {!isRegister ? (
        <PasswordResetModal
          open={showResetModal}
          onClose={() => setShowResetModal(false)}
        />
      ) : null}
    </div>
  );
}
