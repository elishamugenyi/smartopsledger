/**
 * In-memory login rate limits (per server instance). Mitigates brute force and
 * reduces database load from abusive traffic. For multi-instance production,
 * replace with Redis or an edge rate limiter.
 */

/** Max login POSTs per IP per window (reduces DB load / basic DoS). */
const IP_BURST_WINDOW_MS = 10 * 60 * 1000;
const IP_BURST_MAX = 25;

/** Failed auth attempts per IP+email before lockout. */
const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const FAILURE_MAX = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const ipBurstTimestamps = new Map<string, number[]>();
const failureState = new Map<
  string,
  { count: number; windowStart: number; lockedUntil: number }
>();

function pruneTimestamps(timestamps: number[], now: number, windowMs: number) {
  return timestamps.filter((t) => now - t < windowMs);
}

function failureKey(ip: string, email: string) {
  return `${ip}|${email}`;
}

/**
 * Hard cap on how many login attempts an IP can make in a sliding window
 * (valid requests only — caller should invoke after body validation).
 */
export function checkAndRecordLoginIpBurst(ip: string):
  | { ok: true }
  | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  let timestamps = ipBurstTimestamps.get(ip) ?? [];
  timestamps = pruneTimestamps(timestamps, now, IP_BURST_WINDOW_MS);

  if (timestamps.length >= IP_BURST_MAX) {
    const oldest = timestamps[0]!;
    const retryAfterMs = IP_BURST_WINDOW_MS - (now - oldest);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  timestamps.push(now);
  ipBurstTimestamps.set(ip, timestamps);
  return { ok: true };
}

export function getLoginLockoutStatus(
  ip: string,
  email: string,
): { blocked: false } | { blocked: true; retryAfterSec: number } {
  const now = Date.now();
  const key = failureKey(ip, email);
  const s = failureState.get(key);
  if (s && s.lockedUntil > now) {
    return { blocked: true, retryAfterSec: Math.ceil((s.lockedUntil - now) / 1000) };
  }
  return { blocked: false };
}

export function recordFailedLoginAttempt(ip: string, email: string): void {
  const now = Date.now();
  const key = failureKey(ip, email);
  let s = failureState.get(key);

  if (s?.lockedUntil && now < s.lockedUntil) return;

  if (!s || now - s.windowStart > FAILURE_WINDOW_MS) {
    s = { count: 1, windowStart: now, lockedUntil: 0 };
    failureState.set(key, s);
    return;
  }

  s.count += 1;
  if (s.count >= FAILURE_MAX) {
    s.lockedUntil = now + LOCKOUT_MS;
  }
  failureState.set(key, s);
}

export function clearFailedLoginAttempts(ip: string, email: string): void {
  failureState.delete(failureKey(ip, email));
}
