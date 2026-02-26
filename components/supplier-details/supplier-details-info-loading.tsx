import { Skeleton } from "@/components/ui/skeleton";

export function SupplierInfoLoading() {
  return (
    <div className="rounded-xl border-2 border-accent bg-card p-6 shadow-sm sm:mb-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="h-28 w-28 shrink-0 rounded-xl">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-3" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-5/6 max-w-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
