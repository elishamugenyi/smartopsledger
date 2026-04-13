import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyOtpCode } from "@/lib/auth";
import {
  createPasswordResetToken,
  DUMMY_OTP_BCRYPT,
  isSixDigitOtp,
  normalizeResetEmail,
} from "@/lib/password-reset";

type Body = {
  email?: string;
  otp?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  const emailRaw = body?.email?.trim();
  const otpRaw = body?.otp?.trim();

  if (!emailRaw) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }
  if (!otpRaw) {
    return NextResponse.json({ error: "OTP_REQUIRED" }, { status: 400 });
  }
  if (!isSixDigitOtp(otpRaw)) {
    return NextResponse.json({ error: "OTP_INVALID_FORMAT" }, { status: 400 });
  }

  const email = normalizeResetEmail(emailRaw);
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  const activeOtp =
    user?.password != null
      ? await prisma.passwordResetOtp.findFirst({
          where: {
            userId: user.id,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
          select: { codeHash: true },
        })
      : null;

  const otpValid = await verifyOtpCode(otpRaw, activeOtp?.codeHash ?? DUMMY_OTP_BCRYPT);
  if (!otpValid || !user?.password || !activeOtp) {
    return NextResponse.json({ error: "INVALID_OR_EXPIRED_OTP" }, { status: 400 });
  }

  const resetToken = createPasswordResetToken(email, otpRaw);
  return NextResponse.json({ message: "OTP_VERIFIED", resetToken }, { status: 200 });
}
