"use client";

import { Suspense, useState } from "react";
import { PasswordResetModal } from "@/app/components/auth/password-reset-modal";
import { PaymentsConnectSettings } from "@/app/components/dashboard/payments-connect-settings";
import { ThemeSelector } from "@/app/components/dashboard/theme-selector";

type SettingsContentProps = {
  profile: {
    name: string | null;
    email: string;
    createdAt: string;
    subscriptionStatus: string | null;
  };
  paymentsConnect: {
    organizations: Array<{ id: string; name: string }>;
    defaultOrganizationId: string | null;
    canManage: boolean;
  };
};

export function SettingsContent({ profile, paymentsConnect }: SettingsContentProps) {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile and account security so your team always stays in control.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">View Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Name</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profile.name || "Not set"}
            </p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
            <p className="mt-1 text-sm font-medium text-foreground">{profile.email}</p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Subscription</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profile.subscriptionStatus || "None"}
            </p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Joined</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the current OTP password reset flow to securely update your password.
        </p>
        <button
          type="button"
          onClick={() => setPasswordModalOpen(true)}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Start Password Reset
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Invoice payments (Stripe Connect)</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your Stripe account so clients can pay invoices online. Funds go to your Stripe
          account; SmartOps Ledger collects a platform fee on each payment.
        </p>
        <Suspense fallback={<p className="mt-4 text-sm text-muted-foreground">Loading payments...</p>}>
          <PaymentsConnectSettings
            organizations={paymentsConnect.organizations}
            defaultOrganizationId={paymentsConnect.defaultOrganizationId}
            canManage={paymentsConnect.canManage}
          />
        </Suspense>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose light or dark mode for the dashboard. Your preference is saved on this device.
        </p>
        <div className="mt-4">
          <ThemeSelector />
        </div>
      </section>

      <PasswordResetModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
