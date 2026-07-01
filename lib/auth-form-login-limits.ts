/** Minimum gap between login submit attempts (client-side throttle). */
export const CLIENT_LOGIN_MIN_INTERVAL_MS = 2000;

/** Local lockout after this many failed logins in one browser session. */
export const CLIENT_LOGIN_FAILURE_LOCKOUT_AFTER = 5;

export const CLIENT_LOGIN_LOCKOUT_MS = 60_000;
