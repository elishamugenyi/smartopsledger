import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyOtpCode } from "@/lib/auth";
import {
  DUMMY_OTP_BCRYPT,
  verifyPasswordResetToken,
} from "@/lib/password-reset";

type Body = {
  resetToken?: string;
  newPassword?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Body | null;
  const resetToken = body?.resetToken?.trim();
  const newPassword = body?.newPassword;

  if (!resetToken) {
    return NextResponse.json({ error: "RESET_TOKEN_REQUIRED" }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "PASSWORD_MIN_8_CHARS" },
      { status: 400 },
    );
  }

  const tokenResult = verifyPasswordResetToken(resetToken);
  if (!tokenResult.ok) {
    return NextResponse.json(
      { error: "INVALID_OR_EXPIRED_RESET_TOKEN" },
      { status: 400 },
    );
  }
  const { email, otp } = tokenResult.payload;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  const now = new Date();

  const activeOtp =
    user?.password != null
      ? await prisma.passwordResetOtp.findFirst({
          where: {
            userId: user.id,
            expiresAt: { gt: now },
          },
          orderBy: { createdAt: "desc" },
        })
      : null;

  const hashForCompare = activeOtp?.codeHash ?? DUMMY_OTP_BCRYPT;
  const otpValid = await verifyOtpCode(otp, hashForCompare);

  if (!otpValid || !user?.password || !activeOtp) {
    return NextResponse.json(
      { error: "INVALID_OR_EXPIRED_OTP" },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.passwordResetOtp.deleteMany({ where: { userId: user.id } }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
    prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    }),
  ]);

  return NextResponse.json({ message: "PASSWORD_UPDATED" }, { status: 200 });
}
