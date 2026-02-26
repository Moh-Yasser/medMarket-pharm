"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PaginationType} from "@/types/api-response";

const PER_PAGE_OPTIONS = [5, 15, 25, 50] as const;

interface PaginationProps {
  pagination:PaginationType;
  isLoading?: boolean;
}


export function Pagination({
  pagination,
  isLoading = false,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { current_page, last_page, total, from, to, per_page } = pagination;

  const updatePage = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > last_page || newPage === current_page) {
        return;
      }
      const params = new URLSearchParams(searchParams);
      if (newPage > 1) {
        params.set("page", String(newPage));
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [current_page, last_page, pathname, router]
  );

  const handlePrevious = useCallback(() => {
    updatePage(current_page - 1);
  }, [current_page, updatePage]);

  const handleNext = useCallback(() => {
    updatePage(current_page + 1);
  }, [current_page, updatePage]);


  const handlePerPageChange = useCallback(
    (newPerPage: string) => {
      const newPerPageNum = Number(newPerPage);
      if(newPerPageNum === per_page) return;
      const params = new URLSearchParams(searchParams);
      params.set("per_page", String(newPerPageNum));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, per_page, searchParams]
  );


  return (
    <div className="flex flex-col gap-4 border-t bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="text-sm text-muted-foreground">
          عرض <span className="font-medium text-foreground">{from}</span>-
          <span className="font-medium text-foreground">{to}</span> من
          <span className="font-medium text-foreground"> {total}</span> منتج
        </div>

        {/* Per Page Selector */}
        <div className="flex items-center gap-2">
          <Select
            value={String(per_page || 15)}
            onValueChange={handlePerPageChange}
            disabled={isLoading}
          >
            <SelectTrigger
              id="per-page-select"
              className="h-8 w-[70px]"
              aria-label="عدد العناصر في الصفحة"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={current_page <= 1 || isLoading}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only sm:mr-1">السابق</span>
        </Button>

        {/* Current Page (Mobile) */}
        <div className="flex items-center gap-1 sm:hidden">
          <span className="text-sm text-muted-foreground">
            صفحة {current_page} من {last_page}
          </span>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={current_page >= last_page || isLoading}
          aria-label="الصفحة التالية"
        >
          <span className="sr-only sm:not-sr-only sm:ml-1">التالي</span>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

