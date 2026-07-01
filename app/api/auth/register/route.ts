import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, withSessionCookie } from "@/lib/auth";
import { isDatabaseConnectionError } from "@/lib/db-connection-error";

type RegisterBody = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RegisterBody | null;
  const emailRaw = body?.email?.trim();
  const passwordRaw = body?.password;

  if (!emailRaw) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }
  if (!passwordRaw || passwordRaw.length < 8) {
    return NextResponse.json(
      { error: "PASSWORD_MIN_8_CHARS" },
      { status: 400 },
    );
  }

  const email = emailRaw.toLowerCase();
  const passwordHash = await hashPassword(passwordRaw);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: body?.name?.trim() || null,
        accounts: {
          create: {
            provider: "credentials",
            providerAccountId: email,
          },
        },
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    const { sessionToken, expires } = await createSession(user.id);
    const res = NextResponse.json({ user }, { status: 201 });
    return withSessionCookie(res, sessionToken, expires);
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(
        {
          error: "DATABASE_UNAVAILABLE",
          hint: "We cannot reach our servers right now. Check your internet connection and try again in a few minutes.",
        },
        { status: 503 },
      );
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Unique constraint failed") || message.includes("P2002")) {
      return NextResponse.json({ error: "EMAIL_ALREADY_EXISTS" }, { status: 409 });
    }
    return NextResponse.json({ error: "REGISTER_FAILED" }, { status: 500 });
  }
}

