import { NextRequest as NextServerRequest } from "next/server";
import { billing } from "@/lib/billing";
import { getUserFromRequest } from "@/lib/auth";

export const POST = billing.createHandler({
  resolveUser: async (request: Request) => {
    // `billing.createHandler` may consume the request body before `resolveUser`.
    // Reconstruct a lightweight NextRequest from URL+headers so cookie parsing
    // works without touching an already-used body stream.
    const nextRequest = new NextServerRequest(request.url, {
      headers: request.headers,
      method: request.method,
    });
    const user = await getUserFromRequest(nextRequest);

    // This id is used by usebilling for customer mapping (user_id <-> stripe_customer_id).
    return user ? { id: user.id } : null;
  },
});
