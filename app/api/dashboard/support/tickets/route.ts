import crypto from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";

type TicketBody = {
  subject?: string;
  details?: string;
  priority?: string;
};

export async function POST(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const body = (await req.json().catch(() => null)) as TicketBody | null;
  const subject = body?.subject?.trim();
  const details = body?.details?.trim();
  const priority = body?.priority?.trim().toLowerCase();

  if (!subject || !details) {
    return NextResponse.json(
      { error: "SUBJECT_AND_DETAILS_REQUIRED" },
      { status: 400 },
    );
  }

  const ticketId = `TKT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // Placeholder for ticket provider integration.
  console.log("support_ticket_submitted", {
    ticketId,
    userId: auth.user.id,
    subject,
    details,
    priority: priority || "medium",
  });

  return NextResponse.json(
    {
      ok: true,
      ticketId,
      hint: "Our support team will review this ticket and follow up via email.",
    },
    { status: 201 },
  );
}
