"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PaginationType } from "@/types/api-response";

interface SupplierPaginationProps {
  pagination: PaginationType;
  isLoading?: boolean;
}

export function SupplierPagination({
  pagination,
  isLoading = false,
}: SupplierPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { current_page, last_page } = pagination;

  const updatePage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > last_page || newPage === current_page) {
        return;
      }

      const params = new URLSearchParams(searchParams);
      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [current_page, last_page, pathname, router, searchParams]
  );

  const handlePrevious = useCallback(() => {
    updatePage(current_page - 1);
  }, [current_page, updatePage]);

  const handleNext = useCallback(() => {
    updatePage(current_page + 1);
  }, [current_page, updatePage]);

  const visiblePages = useMemo(() => {
    const maxVisiblePages = 3;

    if (last_page <= maxVisiblePages) {
      return Array.from({ length: last_page }, (_, index) => last_page - index);
    }

    const halfWindow = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, current_page - halfWindow);
    let end = Math.min(last_page, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages.reverse();
  }, [current_page, last_page]);

  return (

      <div className="flex items-center justify-center sm:justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 rounded-xs border-border/70 p-0 shadow-sm"
          onClick={handlePrevious}
          disabled={current_page <= 1 || isLoading}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur">
          {visiblePages.map((page) => {
            const isActive = page === current_page;

            return (
              <Button
                key={page}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                className="h-8 min-w-8 rounded-full px-2 text-sm font-semibold transition-all hover:scale-105"
                onClick={() => updatePage(page)}
                disabled={isLoading}
                aria-current={isActive ? "page" : undefined}
                aria-label={`الانتقال إلى الصفحة ${page}`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 rounded-xs border-border/70 p-0 shadow-sm"
          onClick={handleNext}
          disabled={current_page >= last_page || isLoading}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
   
  );
}

