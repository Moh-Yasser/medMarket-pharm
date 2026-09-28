"use client";

import { Search, X, SlidersHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createQueryString } from "@/lib/api/queryString";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.client";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client";
import { SuppliersFilters } from "@/types/filters";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "../ui/field";

function getFiltersFromParams(params: URLSearchParams): SuppliersFilters {
  return {
    search: params.get("search") || "",
    category_id: params.get("category_id") || "all",
    manufacturer_id: params.get("manufacturer_id") || "all",
    page: parseInt(params.get("page") || "1", 10),
    per_page: parseInt(params.get("per_page") || "15", 10),
  };
}

export function SuppliersSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<SuppliersFilters>(() =>
    getFiltersFromParams(searchParams),
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllCategories,
  });

  const { data: manufacturersData } = useQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllManufacturers,
  });

  

  const queryString = createQueryString<SuppliersFilters>(filters);
  const debouncedQuery = useDebounce(queryString, 800);

  const lastSyncedRef = useRef(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedQuery;
      replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`);
    }
  }, [debouncedQuery, pathname, replace]);
  const onFilterChange = (key: keyof SuppliersFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category_id !== "all" ||
    filters.manufacturer_id !== "all" ;

const activeFiltersCount = [
    filters.search,
    filters.category_id !== "all" ? filters.category_id : null,
    filters.manufacturer_id !== "all" ? filters.manufacturer_id : null,
  ].filter(Boolean).length;

  const onClearFilters = () => {
    setFilters({
      category_id: "all",
      manufacturer_id: "all",
      search: "",
    });
  };
  return (
    <div className="space-y-4">
      {/* Search Bar and Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 ">
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="ابحث عن موردين..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pr-9"
            aria-label="البحث عن موردين"
          />
        </div>

        {/* Filter Toggle Button */}

        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "gap-2 text-muted-foreground text-xs hover:text-primary hover:border-primary hover:bg-primary/10 hover:cursor-pointer",
            isOpen && "bg-primary/10 border-primary text-primary",
          )}
          aria-expanded={hasActiveFilters}
          aria-controls="filters-panel"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>تصفية</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="outline"
              className="mr-1 h-5 min-w-5 rounded-full p-0 text-xs text-primary border-primary"
              aria-label={`${activeFiltersCount} فلاتر نشطة`}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="clear"
            onClick={onClearFilters}
            className="gap-2  text-xs  text-muted-foreground hover:border-destructive hover:cursor-pointer"
            aria-label="مسح جميع الفلاتر"
          >
            <Trash className="h-4 w-4" aria-hidden="true" />
            <span>مسح الكل</span>
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <div
          id="filters-panel"
          className="grid grid-cols-1 w-full gap-3 rounded-lg border bg-card p-4 md:grid-cols-3"
        >
          {/* Category Filter */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">
              الفئة
            </FieldLabel>
            <Select
              dir="rtl"
              value={filters.category_id}
              onValueChange={(value) => onFilterChange("category_id", value)}
            >
              <SelectTrigger
                className="w-full sm:w-[180px]"
                aria-label="تصفية حسب الفئة"
              >
                <SelectValue placeholder="جميع الفئات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categoriesData?.data?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {/* Manufacturer Filter */}
          <Field>
            <FieldLabel className="text-muted-foreground text-xs">
              الشركة
            </FieldLabel>
            <Select
              dir="rtl"
              value={filters.manufacturer_id}
              onValueChange={(value) =>
                onFilterChange("manufacturer_id", value)
              }
            >
              <SelectTrigger
                className="w-full sm:w-[190px]"
                aria-label="تصفية حسب الشركة المصنعة"
              >
                <SelectValue placeholder="جميع الشركات المصنعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الشركات المصنعة</SelectItem>
                {manufacturersData?.data?.map((manufacturer) => (
                  <SelectItem
                    key={manufacturer.id}
                    value={String(manufacturer.id)}
                  >
                    {manufacturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      )}
    </div>
  );
}
