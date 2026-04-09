import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="mt-4 h-16 w-full rounded-[24px]" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4 rounded-[32px] border border-border bg-white p-6 shadow-sm">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[520px] w-full rounded-[32px]" />
      </div>
    </div>
  );
}
