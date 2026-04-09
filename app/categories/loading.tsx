import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="mt-4 h-16 w-full rounded-[24px]" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] w-full rounded-[32px]" />
        ))}
      </div>
    </div>
  );
}
