"use client";

import { ServiceUnavailable } from "@/app/components/service-unavailable";
import { isDatabaseConnectionError } from "@/lib/db-connection-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (isDatabaseConnectionError(error)) {
    return (
      <ServiceUnavailable
        reset={reset}
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-xl font-semibold text-black">Something went wrong</h1>
      <p className="mt-3 text-sm text-zinc-600">
        This page could not be loaded. Please try again.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-4 max-w-full break-all font-mono text-xs text-zinc-500">{error.message}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Try again
      </button>
    </div>
  );
}
