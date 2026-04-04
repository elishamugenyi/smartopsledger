import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  verifyPassword,
  withSessionCookie,
} from "@/lib/auth";

type LoginBody = {
  email?: string;
  username?: string;
  password?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as LoginBody | null;
  const identifierRaw = body?.email?.trim() || body?.username?.trim();
  const password = body?.password;

  // Schema has no username field; we treat "username" as email identifier.
  if (!identifierRaw) {
    return NextResponse.json(
      { error: "EMAIL_OR_USERNAME_REQUIRED" },
      { status: 400 },
    );
  }
  if (!password) {
    return NextResponse.json({ error: "PASSWORD_REQUIRED" }, { status: 400 });
  }

  const email = identifierRaw.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, password: true },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const { sessionToken, expires } = await createSession(user.id);
  const res = NextResponse.json(
    { user: { id: user.id, email: user.email, name: user.name } },
    { status: 200 },
  );
  return withSessionCookie(res, sessionToken, expires);
}

