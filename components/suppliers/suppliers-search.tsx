"use client";

import { Search, Filter, X } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createQueryString } from "@/lib/api/queryString";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.client";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client";
import { SuppliersFilters } from "@/types/filters";


interface SuppliersSearchProps {
    onClearFilters: () => void,
     hasActiveFilters: boolean,
   filters:SuppliersFilters,
   onFilterChange:(key: keyof SuppliersFilters, value: string)=>void
}


export function SuppliersSearch({ onClearFilters, filters,onFilterChange  }: SuppliersSearchProps) {
    const pathname = usePathname();
    const { replace } = useRouter();
 const [isOpen,setIsOpen]=useState<boolean>(false);
    const { data: categoriesData } = useQuery({
        queryKey: CATEGORIES_KEYS.all,
        queryFn: getAllCategories,
    });
    
    const { data: manufacturersData } = useQuery({
        queryKey: MANUFACTURERS_KEYS.all,
        queryFn: getAllManufacturers,
    });

    const activeFiltersCount = [
        filters.search,
        filters.category_id !== "all" ? filters.category_id : null,
        filters.manufacturer_id !== "all" ? filters.manufacturer_id : null,
    ].filter(Boolean).length;

    const queryString = createQueryString<SuppliersFilters>(filters);
    const debouncedQuery = useDebounce(queryString, 800);
 const hasActiveFilters = filters.search !== "" || filters.category_id !== "" || filters.manufacturer_id !== "";
    const lastSyncedRef = useRef(debouncedQuery);

    useEffect(() => {
        if (debouncedQuery !== lastSyncedRef.current) {
            lastSyncedRef.current = debouncedQuery;
            replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`);
        }
    }, [debouncedQuery, pathname, replace]);

    return (
        <div className="space-y-4">
        {/* Search Bar and Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="ابحث عن المنتجات..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pr-9"
              aria-label="البحث عن المنتجات"
            />
          </div>
  
          {/* Filter Toggle Button */}
        
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen((prev)=>!prev)}
            className="gap-2"
          >
            <Filter className={`h-4 w-4 ${isOpen ? "rotate-180" : ""}`}  />
            <span>تصفية</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="mr-1 h-5 min-w-5 rounded-full p-0 text-xs"
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
              variant="ghost"
              onClick={onClearFilters}
              className="gap-2 text-muted-foreground hover:text-foreground"
              aria-label="مسح جميع الفلاتر"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span>مسح</span>
            </Button>
          )}
        </div>
  
        {/* Filters Panel */}
        {isOpen && (
        <div
          id="filters-panel"
          className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4 w-fit"
        >
          {/* Category Filter */}
          <Select
            value={filters.category_id}
            onValueChange={(value) => onFilterChange("category_id", value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الفئة">
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
  
          {/* Manufacturer Filter */}
          <Select
            value={filters.manufacturer_id  }
            onValueChange={(value) => onFilterChange("manufacturer_id", value)}
          >
            <SelectTrigger className="w-full sm:w-[190px]" aria-label="تصفية حسب الشركة المصنعة">
              <SelectValue placeholder="جميع الشركات المصنعة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الشركات المصنعة</SelectItem>
              {manufacturersData?.data?.map((manufacturer) => (
                <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                  {manufacturer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
   
        </div>
      )}
      </div>
        
    );
}






