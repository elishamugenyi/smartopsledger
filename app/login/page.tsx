"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/app/components/section-heading";

function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C35.9 6 30.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.2-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 16 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C35.9 6 30.4 4 24 4 16.8 4 10.6 8 6.3 14.7Z"
      />
      <path fill="#4CAF50" d="M24 44c6.3 0 11.8-2.3 15.8-6.2l-7.3-6c-2 1.4-4.5 2.2-8.5 2.2-5.1 0-9.5-3.1-11.2-7.4l-6.5 5C10.6 40 16.8 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.2-5.8 6.8l.1-.1 7.3 6C35.4 39.8 44 33.5 44 24c0-1.3-.1-2.2-.4-3.5Z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
    >
      <path d="M16.365 1.43c0 1.14-.43 2.21-1.18 3.05-.8.9-2.12 1.58-3.23 1.49-.14-1.08.4-2.22 1.13-3.01C13.86 2.06 15.25 1.36 16.365 1.43ZM20.93 17.85c-.52 1.19-.77 1.72-1.45 2.76-.95 1.45-2.29 3.24-3.95 3.26-1.48.02-1.87-.97-3.86-.96-1.99.01-2.42.98-3.9.95-1.66-.03-2.93-1.63-3.88-3.08-2.66-4.1-2.94-8.92-1.29-11.48 1.18-1.81 3.04-2.88 4.79-2.88 1.79 0 2.91.98 4.38.98 1.43 0 2.3-.98 4.37-.98 1.58 0 3.26.86 4.44 2.35-3.86 2.11-3.24 7.62.35 9.08Z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Login failed");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="grid overflow-hidden rounded-[36px] border border-border bg-white shadow-2xl shadow-black/5 lg:grid-cols-[1fr_0.95fr]">
        <div className="relative bg-[linear-gradient(180deg,_#20324a,_#0f766e)] p-8 text-white md:p-10">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(243,178,75,0.18),_transparent_26%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              Secure access
            </div>

            <h1 className="mt-6 max-w-lg text-4xl font-black tracking-tight md:text-6xl">
              Welcome back to Smart Stop Ledger.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/75 md:text-lg">
              Sign in to review your orders, continue checkout, and keep your
              storefront experience smooth across devices.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                "Fast checkout and order tracking",
                "Saved customer details and preferences",
                "A clean account area for returning shoppers",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-white/85">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                Need help?
              </p>
              <p className="mt-2 text-sm leading-7 text-white/75">
                Use any demo account you create later, or jump back to shopping
                if you only want to browse the catalogue.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <SectionHeading
            eyebrow="Login"
            title="Sign in to your account"
            description="A polished, frontend-friendly login screen with a real API hook if you want to use it."
          />

          <div className="mt-8 grid gap-3">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-full border border-border bg-white px-6 font-semibold text-foreground transition-colors hover:bg-muted/60"
            >
              <GoogleLogo />
              Continue with Google
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-6 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <AppleLogo />
              Continue with Apple
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              or use email
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full bg-transparent outline-none"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">
                Password
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 w-full bg-transparent outline-none"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border" />
                Remember me
              </label>
              <Link href="/contact" className="font-semibold text-primary">
                Forgot password?
              </Link>
            </div>

            {error ? (
              <p className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-8 rounded-[28px] border border-border bg-muted/30 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              New here?
            </p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Create the account layer later, or continue browsing the store
              without signing in.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/account"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border bg-white px-5 font-semibold text-foreground"
              >
                View account
              </Link>
              <Link
                href="/products"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-secondary px-5 font-semibold text-white"
              >
                Shop products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
