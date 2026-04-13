import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOtpCode } from "@/lib/auth";
import { sendPasswordResetOtpEmail } from "@/lib/emailjs";
import {
  generateSixDigitOtp,
  normalizeResetEmail,
  PASSWORD_RESET_OTP_TTL_MS,
  PASSWORD_RESET_RESEND_COOLDOWN_MS,
} from "@/lib/password-reset";

type Body = { email?: string };

const PUBLIC_OK_MESSAGE =
  "If an account exists for that email, a reset code has been sent.";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  const emailRaw = body?.email?.trim();

  if (!emailRaw) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }

  const email = normalizeResetEmail(emailRaw);
  if (!email.includes("@")) {
    return NextResponse.json({ error: "EMAIL_INVALID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, name: true },
  });

  // Same response whether or not the user exists (credential accounts only).
  if (!user?.password) {
    return NextResponse.json({ message: PUBLIC_OK_MESSAGE }, { status: 200 });
  }

  const latest = await prisma.passwordResetOtp.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (
    latest &&
    Date.now() - latest.createdAt.getTime() < PASSWORD_RESET_RESEND_COOLDOWN_MS
  ) {
    // Same response as success so callers cannot infer account existence or timing.
    return NextResponse.json({ message: PUBLIC_OK_MESSAGE }, { status: 200 });
  }

  const plainOtp = generateSixDigitOtp();
  const codeHash = await hashOtpCode(plainOtp);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_OTP_TTL_MS);

  const sendResult = await sendPasswordResetOtpEmail({
    toEmail: user.email,
    otp: plainOtp,
    userName: user.name,
  });

  if (!sendResult.ok) {
    console.error("[password-reset] EmailJS send failed:", sendResult.message);
    // Do not persist an OTP the user never received; same JSON as unknown email.
    return NextResponse.json({ message: PUBLIC_OK_MESSAGE }, { status: 200 });
  }

  await prisma.$transaction([
    prisma.passwordResetOtp.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    }),
  ]);

  return NextResponse.json({ message: PUBLIC_OK_MESSAGE }, { status: 200 });
}
