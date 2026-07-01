"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  MAX_MEMBER_ROLE_PER_ORGANIZATION,
  MAX_OWNED_ORGANIZATIONS,
} from "@/lib/organization-limits";

type OrgMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

type OrganizationRecord = {
  role: "OWNER" | "ADMIN" | "MEMBER";
  organization: {
    id: string;
    name: string;
    ownerId: string;
    members: OrgMember[];
  };
};

type OrganizationsResponse = {
  organizations: OrganizationRecord[];
  ownedOrganizationCount: number;
};

export function OrganizationContent() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [ownedOrganizationCount, setOwnedOrganizationCount] = useState(0);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [loading, setLoading] = useState(true);
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizations = useCallback(async () => {
    const response = await fetch("/api/dashboard/organizations", {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to load organizations");

    const data = (await response.json()) as OrganizationsResponse;
    setOrganizations(data.organizations);
    setOwnedOrganizationCount(data.ownedOrganizationCount ?? 0);
    if (!selectedOrganizationId && data.organizations.length > 0) {
      setSelectedOrganizationId(data.organizations[0].organization.id);
    }
  }, [selectedOrganizationId]);

  useEffect(() => {
    const run = async () => {
      try {
        await loadOrganizations();
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [loadOrganizations]);

  const onCreateOrganization = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    setCreatingOrg(true);
    setError(null);
    setMessage(null);

    const form = new FormData(formEl);
    const payload = { name: String(form.get("name") || "") };

    try {
      const response = await fetch("/api/dashboard/organizations", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { hint?: string; error?: string };
      if (!response.ok) throw new Error(data.hint || data.error || "Failed to create organization");

      setMessage(data.hint || "Organization created.");
      formEl.reset();
      await loadOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setCreatingOrg(false);
    }
  };

  const onAddMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    setAddingMember(true);
    setError(null);
    setMessage(null);

    const form = new FormData(formEl);
    const organizationId = String(form.get("organizationId") || "");
    const payload = {
      email: String(form.get("email") || ""),
      role: String(form.get("role") || "MEMBER"),
    };

    try {
      const response = await fetch(
        `/api/dashboard/organizations/${organizationId}/members`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { hint?: string; error?: string };
      if (!response.ok) throw new Error(data.hint || data.error || "Failed to add member");

      setMessage(data.hint || "Member added successfully.");
      formEl.reset();
      setInviteRole("MEMBER");
      await loadOrganizations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const selectedOrganization = organizations.find(
    (org) => org.organization.id === selectedOrganizationId,
  );
  const selectedMemberRoleCount =
    selectedOrganization?.organization.members.filter((m) => m.role === "MEMBER").length ?? 0;
  const atMemberLimit =
    inviteRole === "MEMBER" &&
    selectedMemberRoleCount >= MAX_MEMBER_ROLE_PER_ORGANIZATION;
  const atDepartmentLimit = ownedOrganizationCount >= MAX_OWNED_ORGANIZATIONS;

  if (loading) return <p className="text-sm text-zinc-600">Loading organizations...</p>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Organization</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Create organizations (Finance, Sales, Accounting, Legal, or Sole) and
          invite members. This tab is always open and never locked.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          You can own at most {MAX_OWNED_ORGANIZATIONS} departments (organizations) and add at
          most {MAX_MEMBER_ROLE_PER_ORGANIZATION} members per department (Member role; admins do
          not count toward that cap).
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          Cue: only one <strong>ADMIN</strong> is allowed per organization.
          Recommended admin is the account owner who created the organization.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Create Organization</h2>
        {atDepartmentLimit ? (
          <p className="mt-2 text-sm text-amber-800">
            You have reached the limit of {MAX_OWNED_ORGANIZATIONS} departments for your account.
          </p>
        ) : null}
        <form className="mt-4 flex flex-wrap items-center gap-3" onSubmit={onCreateOrganization}>
          <input
            name="name"
            required
            placeholder="e.g. Finance, Sales, Accounting, Legal, Sole"
            className="min-w-[300px] rounded-lg border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={creatingOrg || atDepartmentLimit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
          >
            {creatingOrg ? "Creating..." : "Create Organization"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Add Organization Members</h2>
        {atMemberLimit ? (
          <p className="mt-2 text-sm text-amber-800">
            This organization already has {MAX_MEMBER_ROLE_PER_ORGANIZATION} members. Choose
            &quot;Admin&quot; to invite an admin instead, or use another department.
          </p>
        ) : null}
        <p className="mt-2 text-sm text-zinc-600">
          Cue: member must already have an account in the system. Add by email.
        </p>
        <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={onAddMember}>
          <select
            name="organizationId"
            value={selectedOrganizationId}
            onChange={(event) => setSelectedOrganizationId(event.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm"
            required
          >
            {organizations.length === 0 ? (
              <option value="">No organization yet</option>
            ) : (
              organizations.map((org) => (
                <option key={org.organization.id} value={org.organization.id}>
                  {org.organization.name}
                </option>
              ))
            )}
          </select>
          <input
            name="email"
            type="email"
            required
            placeholder="member@email.com"
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <select
            name="role"
            value={inviteRole}
            onChange={(event) =>
              setInviteRole(event.target.value === "ADMIN" ? "ADMIN" : "MEMBER")
            }
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin (only if none exists)</option>
          </select>
          <button
            type="submit"
            disabled={addingMember || !selectedOrganizationId || atMemberLimit}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-70"
          >
            {addingMember ? "Adding..." : "Add Member"}
          </button>
        </form>
      </section>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Your Organizations</h2>
        <div className="mt-4 space-y-4">
          {organizations.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No organizations found yet. Create one above to continue with dashboard
              operations.
            </p>
          ) : (
            organizations.map((org) => (
              <article key={org.organization.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-black">{org.organization.name}</p>
                <p className="text-xs text-zinc-600">Your role: {org.role}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Members
                </p>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                  {org.organization.members.map((member) => (
                    <li key={member.id}>
                      {(member.user?.name || member.user?.email || "Member") +
                        " - " +
                        member.role}
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>

      {selectedOrganization ? (
        <section className="rounded-2xl border border-border bg-zinc-50 p-5">
          <h3 className="text-sm font-semibold text-black">Next step cue</h3>
          <p className="mt-1 text-sm text-zinc-600">
            After setting up <strong>{selectedOrganization.organization.name}</strong>,
            return to Payments, Invoices, Expenses, and Revenue to run organization data
            operations.
          </p>
        </section>
      ) : null}
    </div>
  );
}
