import crypto from "crypto";

/** Exactly five minutes from creation (used for `expiresAt`). */
export const PASSWORD_RESET_OTP_TTL_MS = 5 * 60 * 1000;

/** Minimum time between OTP emails for the same account. */
export const PASSWORD_RESET_RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Fixed bcrypt hash used when we must run compare without a real OTP row
 * (mitigates timing/user-enumeration vs missing user or missing OTP).
 */
export const DUMMY_OTP_BCRYPT =
  "$2b$10$cCA6A9SqScfZjUyo7jHJMerLrOV6v0CUpSgXFR68Fz5UZu4NcPXwy";

export function normalizeResetEmail(raw: string) {
  return raw.trim().toLowerCase();
}

/** Cryptographic 6-digit code, zero-padded (000000–999999). */
export function generateSixDigitOtp(): string {
  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, "0");
}

export function isSixDigitOtp(value: string) {
  return /^\d{6}$/.test(value);
}

type ResetTokenPayload = {
  email: string;
  otp: string;
  exp: number;
};

const RESET_TOKEN_TTL_MS = 5 * 60 * 1000;

function getResetTokenSecret() {
  return (
    process.env.PASSWORD_RESET_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-password-reset-secret"
  );
}

function toBase64Url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function createPasswordResetToken(email: string, otp: string) {
  const payload: ResetTokenPayload = {
    email: normalizeResetEmail(email),
    otp,
    exp: Date.now() + RESET_TOKEN_TTL_MS,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getResetTokenSecret())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyPasswordResetToken(
  token: string,
): { ok: true; payload: ResetTokenPayload } | { ok: false } {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return { ok: false };

  const expectedSig = crypto
    .createHmac("sha256", getResetTokenSecret())
    .update(encodedPayload)
    .digest("base64url");

  if (signature !== expectedSig) return { ok: false };

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as ResetTokenPayload;
    if (!payload.email || !payload.otp || !payload.exp) return { ok: false };
    if (!isSixDigitOtp(payload.otp)) return { ok: false };
    if (payload.exp <= Date.now()) return { ok: false };
    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
}
