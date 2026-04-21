"use client";

import { useState } from "react";
import { PasswordResetModal } from "@/app/components/auth/password-reset-modal";

type SettingsContentProps = {
  profile: {
    name: string | null;
    email: string;
    createdAt: string;
    subscriptionStatus: string | null;
  };
};

export function SettingsContent({ profile }: SettingsContentProps) {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage your profile and account security so your team always stays in control.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">View Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Name</p>
            <p className="mt-1 text-sm font-medium text-black">
              {profile.name || "Not set"}
            </p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Email</p>
            <p className="mt-1 text-sm font-medium text-black">{profile.email}</p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Subscription</p>
            <p className="mt-1 text-sm font-medium text-black">
              {profile.subscriptionStatus || "None"}
            </p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Joined</p>
            <p className="mt-1 text-sm font-medium text-black">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Change Password</h2>
        <p className="mt-2 text-sm text-zinc-600">
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

      <section className="rounded-2xl border border-border bg-zinc-50 p-5">
        <h3 className="text-sm font-semibold text-black">Useful next settings to add</h3>
        <p className="mt-2 text-sm text-zinc-600">
          You can add notification preferences, session/device management, two-factor
          authentication, theme/display preferences, and default organization selection.
        </p>
      </section>

      <PasswordResetModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
