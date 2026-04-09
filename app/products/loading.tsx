import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-16 w-full rounded-[24px]" />
      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[420px] w-full rounded-[32px]" />
        ))}
      </div>
    </div>
  );
}
