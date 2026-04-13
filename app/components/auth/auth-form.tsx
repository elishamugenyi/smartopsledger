"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { AuthInput } from "@/app/components/auth/auth-input";
import { PasswordResetModal } from "@/app/components/auth/password-reset-modal";

type Mode = "register" | "login";

type Props = {
  mode: Mode;
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const isRegister = mode === "register";

  const heading = isRegister ? "Create your SmartOps account" : "Welcome back";
  const subHeading = isRegister
    ? "Set up your secure workspace in minutes."
    : "Log in to continue managing operations and ledgers.";

  const validate = (value: FormState): FormErrors => {
    const next: FormErrors = {};

    if (isRegister) {
      const cleanName = value.name.trim();
      if (!cleanName) next.name = "Name is required.";
      else if (cleanName.length < 2) next.name = "Use at least 2 characters.";
      else if (cleanName.length > 80) next.name = "Name is too long.";
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

  const canSubmit = !loading && Object.keys(validate(state)).length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const nextErrors = validate(state);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

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

      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        const code = data?.error ?? "AUTH_FAILED";
        if (code === "EMAIL_ALREADY_EXISTS") {
          setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
        } else if (code === "INVALID_CREDENTIALS") {
          setServerError("Invalid email or password.");
        } else if (code === "PASSWORD_MIN_8_CHARS") {
          setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
        } else {
          setServerError("Unable to continue right now. Please try again.");
        }
        return;
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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {isRegister ? (
          <AuthInput
            label="Full name"
            name="name"
            value={state.name}
            onChange={(value) => setState((prev) => ({ ...prev, name: value }))}
            placeholder="Jane Doe"
            autoComplete="name"
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
