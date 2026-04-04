import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, withSessionCookie } from "@/lib/auth";
import { verifyGoogleIdToken } from "@/lib/google";

type GoogleLoginBody = {
  idToken?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as GoogleLoginBody | null;
  const idToken = body?.idToken;

  if (!idToken) {
    return NextResponse.json({ error: "ID_TOKEN_REQUIRED" }, { status: 400 });
  }

  try {
    const payload = await verifyGoogleIdToken(idToken);
    const email = payload.email.toLowerCase();
    const providerAccountId = payload.sub;

    const user = await prisma.$transaction(async (tx) => {
      const existingAccount = await tx.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId,
          },
        },
        include: { user: true },
      });
      if (existingAccount?.user) return existingAccount.user;

      const existingUser = await tx.user.findUnique({ where: { email } });
      const ensuredUser =
        existingUser ??
        (await tx.user.create({
          data: {
            email,
            name: payload.name || null,
          },
        }));

      await tx.account.create({
        data: {
          userId: ensuredUser.id,
          provider: "google",
          providerAccountId,
        },
      });

      return ensuredUser;
    });

    const { sessionToken, expires } = await createSession(user.id);
    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 },
    );
    return withSessionCookie(res, sessionToken, expires);
  } catch {
    return NextResponse.json({ error: "GOOGLE_LOGIN_FAILED" }, { status: 401 });
  }
}

