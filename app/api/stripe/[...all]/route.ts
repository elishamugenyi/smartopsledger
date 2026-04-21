import { NextRequest as NextServerRequest } from "next/server";
import { billing } from "@/lib/billing";
import { getUserFromRequest } from "@/lib/auth";

export const POST = billing.createHandler({
  resolveUser: async (request: Request) => {
    const nextRequest = new NextServerRequest(request);
    const user = await getUserFromRequest(nextRequest);

    // This id is used by usebilling for customer mapping (user_id <-> stripe_customer_id).
    return user ? { id: user.id } : null;
  },
});
