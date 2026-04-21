"use client";

import { FormEvent, useState } from "react";

export function SupportContent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      subject: String(form.get("subject") || ""),
      details: String(form.get("details") || ""),
      priority: String(form.get("priority") || "medium"),
    };

    try {
      const response = await fetch("/api/dashboard/support/tickets", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ticketId?: string; hint?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to submit ticket");
      setMessage(`Ticket submitted (${data.ticketId}). ${data.hint || ""}`.trim());
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-black">Support</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Find help resources, contact support by email, or report issues as tickets.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Email Contact</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Reach us at <a className="font-semibold text-primary hover:underline" href="mailto:support@smartopsledger.com">support@smartopsledger.com</a>.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Help Articles (FAQ)</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700">
          <li>- How to set up your first organization and add members</li>
          <li>- How subscription access works across organization members</li>
          <li>- How to create invoices and track payment status</li>
          <li>- How to categorize expense vs revenue entries correctly</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">Report an Issue (Ticket)</h2>
        <form className="mt-4 grid gap-3" onSubmit={submitTicket}>
          <input
            name="subject"
            required
            placeholder="Issue subject"
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <select
            name="priority"
            className="w-44 rounded-lg border border-border px-3 py-2 text-sm"
            defaultValue="medium"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <textarea
            name="details"
            required
            placeholder="Describe what happened, expected behavior, and steps to reproduce."
            rows={5}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-900 disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
        {message ? <p className="mt-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="rounded-2xl border border-border bg-zinc-50 p-5">
        <h3 className="text-sm font-semibold text-black">Extra support ideas</h3>
        <p className="mt-2 text-sm text-zinc-600">
          You can add live chat, guided onboarding tours, release notes, and a status page
          so users always know where to get help.
        </p>
      </section>
    </div>
  );
}
