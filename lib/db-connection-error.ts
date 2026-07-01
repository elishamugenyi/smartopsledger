/** Thrown when the app cannot reach the database (network, timeout, etc.). */
export class DatabaseUnavailableError extends Error {
  constructor() {
    super("Unable to connect to our servers. Check your internet connection and try again.");
    this.name = "DatabaseUnavailableError";
  }
}

/**
 * Detect Prisma / driver errors that usually mean the database is unreachable,
 * slow, or the connection dropped (user should retry, not see a stack trace).
 */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; name?: string; message?: string };

  if (e.name === "DatabaseUnavailableError") return true;
  if (typeof e.code === "string") {
    if (/^P10(01|02|17)$/.test(e.code)) return true;
  }
  if (e.name === "PrismaClientInitializationError") return true;
  if (typeof e.message === "string") {
    const m = e.message.toLowerCase();
    if (m.includes("can't reach database server")) return true;
    if (m.includes("server has closed the connection")) return true;
    if (m.includes("connection reset")) return true;
    if (m.includes("econnrefused")) return true;
    if (m.includes("etimedout")) return true;
    if (m.includes("timeout") && m.includes("connection")) return true;
  }
  return false;
}

const DEFAULT_DB_RETRY_ATTEMPTS = 2;
const DEFAULT_DB_RETRY_DELAY_MS = 400;

/**
 * Retry transient database connection failures (common with serverless Postgres).
 */
export async function withDatabaseRetry<T>(
  operation: () => Promise<T>,
  options?: { retries?: number; delayMs?: number },
): Promise<T> {
  const retries = options?.retries ?? DEFAULT_DB_RETRY_ATTEMPTS;
  const delayMs = options?.delayMs ?? DEFAULT_DB_RETRY_DELAY_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isDatabaseConnectionError(error) || attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }

  throw lastError;
}

export function databaseUnavailableResponse() {
  return Response.json(
    {
      error: "DATABASE_UNAVAILABLE",
      hint: "Unable to reach the database. Wait a moment and try again.",
    },
    { status: 503 },
  );
}
