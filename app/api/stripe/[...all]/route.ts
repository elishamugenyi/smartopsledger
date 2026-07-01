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

    // usebilling passes `email` / `name` into Stripe when creating customers and
    // binds Checkout to that customer so the billing email matches the login email.
    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        }
      : null;
  },
});
