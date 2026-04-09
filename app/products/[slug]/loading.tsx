import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Skeleton className="h-10 w-44 rounded-full" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Skeleton className="h-[620px] w-full rounded-[36px]" />
        <div className="space-y-5 rounded-[28px] border border-border bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-12 w-5/6" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-28 w-full rounded-[24px]" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-28 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  );
}
