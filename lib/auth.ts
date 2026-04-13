import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "sol_session";
const SESSION_MAX_AGE_DAYS = 30;

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

const OTP_BCRYPT_ROUNDS = 10;

/** Hash a 6-digit OTP before persisting (short-lived codes use slightly lower cost than passwords). */
export async function hashOtpCode(code: string) {
  return bcrypt.hash(code, OTP_BCRYPT_ROUNDS);
}

export async function verifyOtpCode(code: string, codeHash: string) {
  return bcrypt.compare(code, codeHash);
}

export async function createSession(userId: string) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(
    Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expires,
    },
  });

  return { sessionToken, expires };
}

export function withSessionCookie(
  res: NextResponse,
  sessionToken: string,
  expires: Date,
) {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
  return res;
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
  return res;
}

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expires.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { sessionToken: token } });
    return null;
  }

  return session.user;
}

export async function requireUser(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };
  }
  return { ok: true as const, user };
}

