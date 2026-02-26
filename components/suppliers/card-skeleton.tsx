import { Skeleton } from "@/components/ui/skeleton";

 function CardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border bg-card p-6">
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <Skeleton className="mt-4 h-4 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-1 h-3 w-3/4" />
    </div>
  );
}

export default function SuppliersLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Skeleton className="h-7 w-28" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-9 flex-1 max-w-md rounded-md" />
          <Skeleton className="h-9 w-full sm:w-[180px] rounded-md" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
