import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  verifyPassword,
  withSessionCookie,
} from "@/lib/auth";
import { isDatabaseConnectionError } from "@/lib/db-connection-error";
import {
  checkAndRecordLoginIpBurst,
  clearFailedLoginAttempts,
  getLoginLockoutStatus,
  recordFailedLoginAttempt,
} from "@/lib/login-rate-limit";
import { getClientIp } from "@/lib/request-ip";

type LoginBody = {
  email?: string;
  username?: string;
  password?: string;
};

const RATE_LIMIT_JSON = {
  error: "RATE_LIMITED" as const,
  hint: "Too many login attempts. Please wait before trying again.",
};

const DB_UNAVAILABLE_JSON = {
  error: "DATABASE_UNAVAILABLE" as const,
  hint: "We cannot reach our servers right now. Check your internet connection and try again in a few minutes.",
};

function jsonWithRetryAfter(
  body: Record<string, unknown>,
  retryAfterSec: number,
  status: number,
) {
  const res = NextResponse.json({ ...body, retryAfterSec }, { status });
  res.headers.set("Retry-After", String(retryAfterSec));
  return res;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as LoginBody | null;
  const identifierRaw = body?.email?.trim() || body?.username?.trim();
  const password = body?.password;

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
  const ip = getClientIp(req);

  const burst = checkAndRecordLoginIpBurst(ip);
  if (!burst.ok) {
    return jsonWithRetryAfter(RATE_LIMIT_JSON, burst.retryAfterSec, 429);
  }

  const lockout = getLoginLockoutStatus(ip, email);
  if (lockout.blocked) {
    return jsonWithRetryAfter(
      {
        ...RATE_LIMIT_JSON,
        hint: "Too many failed login attempts for this account. Please wait before trying again.",
      },
      lockout.retryAfterSec,
      429,
    );
  }

  let user: { id: string; email: string; name: string | null; password: string | null } | null;
  try {
    user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(DB_UNAVAILABLE_JSON, { status: 503 });
    }
    throw err;
  }

  if (!user || !user.password) {
    recordFailedLoginAttempt(ip, email);
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const passwordOk = await verifyPassword(password, user.password);
  if (!passwordOk) {
    recordFailedLoginAttempt(ip, email);
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  try {
    const { sessionToken, expires } = await createSession(user.id);
    clearFailedLoginAttempts(ip, email);
    const res = NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 },
    );
    return withSessionCookie(res, sessionToken, expires);
  } catch (err: unknown) {
    if (isDatabaseConnectionError(err)) {
      return NextResponse.json(DB_UNAVAILABLE_JSON, { status: 503 });
    }
    throw err;
  }
}
