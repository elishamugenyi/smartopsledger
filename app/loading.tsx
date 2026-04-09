import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <div className="space-y-6">
        <Skeleton className="h-14 w-56 rounded-full" />

        <section className="grid gap-8 overflow-hidden rounded-[36px] border border-border bg-white p-6 shadow-sm lg:grid-cols-[1.05fr_0.95fr] md:p-8">
          <div className="space-y-5">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-20 w-full rounded-[24px]" />
            <Skeleton className="h-8 w-5/6 rounded-[24px]" />
            <Skeleton className="h-8 w-4/6 rounded-[24px]" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-[22px]" />
              ))}
            </div>
          </div>

          <Skeleton className="h-[560px] w-full rounded-[36px]" />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-10 w-72" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[360px] w-full rounded-[32px]" />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[420px] w-full rounded-[32px]" />
          <Skeleton className="h-[420px] w-full rounded-[32px]" />
        </section>

        <section className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-[28px]" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
