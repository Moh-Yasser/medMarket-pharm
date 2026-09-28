"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { EmptyState, SupplierGridCard } from "./suppliers-grid-cart";
import { Supplier, SuppliersApiResponse } from "@/types/company";
import { SuppliersFilters } from "@/types/filters";
import { SuppliersSearch } from "./suppliers-search";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import SuppliersLoading from "./card-skeleton";
import { SuppliersError } from "./suppliers-error";

export function useSuppliersFiltersFromURL(): SuppliersFilters {
  const searchParams = useSearchParams();

  return useMemo<SuppliersFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      category_id: searchParams.get("category_id") || "",
      manufacturer_id: searchParams.get("manufacturer_id") || "",
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}

export function SuppliersContent() {
  const filters = useSuppliersFiltersFromURL();

  const {
    data: fetchedData,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    status,
  } = useInfiniteQuery<SuppliersApiResponse>({
    queryKey: SUPPLIERS_KEYS.list(filters),
    queryFn: ({ pageParam }) =>
      getAllSuppliers({ ...filters, page: pageParam as number }),
    initialPageParam: filters.page ?? 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const suppliersData: Supplier[] =
    fetchedData?.pages.flatMap((page) => page.data) ?? [];

  
  const loadMoreRef = useInfiniteScrollTrigger({
    onIntersect: fetchNextPage,
    enabled: Boolean(hasNextPage) && !isFetching && status !== "error",
  });

  const isInitialLoading = status === "pending";

  const hasFatalError = status === "error" && !fetchedData;

  const handleRetry = () => {
    void (isFetchNextPageError ? fetchNextPage() : refetch());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="flex items-center justify-between ">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">الموردين</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تصفح واطلب المنتجات من موردين متعددين
          </p>
        </div>
      </div>

      {/* Always mounted — typing here must never unmount/remount this input */}
      <SuppliersSearch />

      <div className="mt-6 min-h-[calc(53vh)]">
        {isInitialLoading ? (
          <SuppliersLoading />
        ) : hasFatalError ? (
          <SuppliersError onRetry={handleRetry} />
        ) : suppliersData.length === 0 ? (
          <EmptyState hasFilters={false} onClear={() => {}} />
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {suppliersData.map((supplier: Supplier) => (
                <SupplierGridCard key={supplier.id} supplier={supplier} />
              ))}
            </div>

            {isFetchingNextPage && (
              <div
                role="status"
                className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground"
              >
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                جارٍ تحميل المزيد...
              </div>
            )}

            {/* Next-page failure: keep the loaded suppliers, offer retry */}
            {status === "error" && !isFetching && (
              <SuppliersError compact onRetry={handleRetry} />
            )}

            {/* Infinite scroll sentinel */}
            {hasNextPage && status !== "error" && (
              <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
            )}
          </>
        )}
      </div>
    </div>
  );
}