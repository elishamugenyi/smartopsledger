import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="grid overflow-hidden rounded-[36px] border border-border bg-white shadow-2xl shadow-black/5 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-5 bg-secondary p-8 md:p-10">
          <Skeleton className="h-8 w-40 bg-white/10" />
          <Skeleton className="h-16 w-full bg-white/10" />
          <Skeleton className="h-16 w-5/6 bg-white/10" />
          <Skeleton className="h-20 w-full rounded-[30px] bg-white/10" />
          <Skeleton className="h-20 w-full rounded-[30px] bg-white/10" />
        </div>
        <div className="space-y-5 p-8 md:p-10">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-40 rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
