"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type ConnectStatus = {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  stripeConnectAccountId: string | null;
};

type PaymentsConnectSettingsProps = {
  organizations: Array<{ id: string; name: string }>;
  defaultOrganizationId: string | null;
  canManage: boolean;
};

export function PaymentsConnectSettings({
  organizations,
  defaultOrganizationId,
  canManage,
}: PaymentsConnectSettingsProps) {
  const searchParams = useSearchParams();
  const retryOrganizationId = searchParams.get("organizationId");
  const [organizationId, setOrganizationId] = useState(
    retryOrganizationId ?? defaultOrganizationId ?? organizations[0]?.id ?? "",
  );
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (retryOrganizationId && organizations.some((org) => org.id === retryOrganizationId)) {
      setOrganizationId(retryOrganizationId);
    } else if (
      defaultOrganizationId &&
      organizations.some((org) => org.id === defaultOrganizationId)
    ) {
      setOrganizationId(defaultOrganizationId);
    } else if (organizations[0]?.id) {
      setOrganizationId(organizations[0].id);
    }
  }, [defaultOrganizationId, organizations, retryOrganizationId]);

  const loadStatus = useCallback(async () => {
    if (!organizationId) {
      setStatus(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ organizationId });
      const response = await fetch(`/api/stripe/connect/status?${params.toString()}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("status_failed");
      const data = (await response.json()) as ConnectStatus;
      setStatus(data);
    } catch {
      setError("Could not load Stripe Connect status.");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const onConnect = async () => {
    if (!organizationId || !canManage) return;
    setConnecting(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/connect/onboard", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      const data = (await response.json()) as { url?: string; error?: string; hint?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.hint ?? data.error ?? "onboard_failed");
      }
      window.location.href = data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "onboard_failed";
      setError(
        message === "onboard_failed"
          ? "Unable to start Stripe onboarding. Try again in a moment."
          : message,
      );
      setConnecting(false);
    }
  };

  const showRetryHint = searchParams.get("connect") === "retry";
  const selectedOrganization = organizations.find((org) => org.id === organizationId);

  if (organizations.length === 0) {
    return (
      <p className="mt-2 text-sm text-zinc-600">
        Create an organization first to connect Stripe for invoice payments.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {showRetryHint ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Your previous Stripe link expired. Click below to continue setup.
        </p>
      ) : null}

      {organizations.length > 1 ? (
        <label className="block text-sm text-zinc-700">
          <span className="mb-1 block font-medium text-black">Organization</span>
          <select
            value={organizationId}
            onChange={(event) => setOrganizationId(event.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </label>
      ) : selectedOrganization ? (
        <p className="text-sm text-zinc-600">
          Connecting Stripe for <span className="font-medium text-black">{selectedOrganization.name}</span>.
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-600">Checking Stripe connection...</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Account</p>
            <p className="mt-1 text-sm font-medium text-black">
              {status?.connected ? "Connected" : "Not connected"}
            </p>
          </article>
          <article className="rounded-lg border border-border p-3">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Accept payments</p>
            <p className="mt-1 text-sm font-medium text-black">
              {status?.chargesEnabled ? "Ready" : "Setup required"}
            </p>
          </article>
        </div>
      )}

      <p className="text-sm text-zinc-600">
        Connect Stripe Express so clients pay invoices directly to your business. SmartOps Ledger
        routes payments and collects a platform fee (default 2.5%, configurable).
      </p>

      {canManage ? (
        <button
          type="button"
          onClick={onConnect}
          disabled={connecting || loading || !organizationId}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
        >
          {connecting
            ? "Redirecting to Stripe..."
            : status?.chargesEnabled
              ? "Update Stripe account"
              : "Connect Stripe"}
        </button>
      ) : (
        <p className="text-sm text-zinc-500">
          Only organization admins can connect Stripe.
        </p>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
