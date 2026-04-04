import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionCookieName } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(getSessionCookieName())?.value;
  if (token) {
    await prisma.session.delete({ where: { sessionToken: token } }).catch(() => {});
  }
  return clearSessionCookie(NextResponse.json({ ok: true }, { status: 200 }));
}

