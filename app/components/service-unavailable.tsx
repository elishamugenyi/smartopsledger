"use client";

type Props = {
  reset?: () => void;
  className?: string;
};

export function ServiceUnavailable({
  reset,
  className = "mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 text-center",
}: Props) {
  return (
    <div className={className}>
      <h1 className="text-xl font-semibold text-foreground">Connection problem</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We couldn&apos;t reach our servers. Check your internet connection and try again in a few
        moments.
      </p>
      {reset ? (
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
