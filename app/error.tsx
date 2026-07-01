"use client";

import { ServiceUnavailable } from "@/app/components/service-unavailable";
import { isDatabaseConnectionError } from "@/lib/db-connection-error";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (isDatabaseConnectionError(error)) {
    return <ServiceUnavailable reset={reset} />;
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We ran into an unexpected problem loading this page. Please try again.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-4 max-w-full break-all font-mono text-xs text-zinc-500">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
