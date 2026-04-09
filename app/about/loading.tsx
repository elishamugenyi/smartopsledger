import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="mt-4 h-16 w-full rounded-[24px]" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[280px] w-full rounded-[32px]" />
        <Skeleton className="h-[280px] w-full rounded-[32px]" />
      </div>
    </div>
  );
}
