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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {  Category, Manufacturer, ProductsFilters } from "@/types/filters";
import { createQueryString } from "@/lib/api/queryString";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { Supplier, SuppliersApiResponse } from "@/types/company";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "../ui/field";

function getFiltersFromParams(params: URLSearchParams): ProductsFilters {
  return {
    search: params.get("search") || "",
    category_id: params.get("category_id") || "all",
    manufacturer_id: params.get("manufacturer_id") || "all",
    supplier_company_id: params.get("supplier_company_id") || "all",
    page: parseInt(params.get("page") || "1", 10),
    per_page: parseInt(params.get("per_page") || "15", 10),
  };
}

type ProductsSearchProps ={
manufacturers:Manufacturer[];
categories:Category[];
}

export function ProductsSearch({manufacturers,categories}:ProductsSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<ProductsFilters>(() =>
    getFiltersFromParams(searchParams),
  );
 

  const { data: suppliersData } = useQuery<SuppliersApiResponse>({
    queryKey: SUPPLIERS_KEYS.list(),
    queryFn: () => getAllSuppliers(),
  });

  const queryString = createQueryString<ProductsFilters>(filters);
  const debouncedQuery = useDebounce(queryString, 800);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lastSyncedRef = useRef(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedQuery;
      replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`);
    }
  }, [debouncedQuery, pathname, replace]);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category_id !== "all" ||
    filters.manufacturer_id !== "all" ||
    filters.supplier_company_id !== "all";

  const activeFiltersCount = [
    filters.search,
    filters.category_id !== "all" ? filters.category_id : null,
    filters.manufacturer_id !== "all" ? filters.manufacturer_id : null,
    filters.supplier_company_id !== "all" ? filters.supplier_company_id : null,
  ].filter(Boolean).length;

  const onFilterChange = (key: keyof ProductsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onClearFilters = () => {
    setFilters({
      category_id: "all",
      manufacturer_id: "all",
      supplier_company_id: "all",
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
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground "
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="ابحث عن المنتجات..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pr-9 rounded-xl "
            aria-label="البحث عن المنتجات"
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
            <FieldLabel className="text-muted-foreground text-xs">الفئة</FieldLabel>
          <Select
          dir="rtl"
            value={filters.category_id}
            onValueChange={(value) => onFilterChange("category_id", value)}
           
          >
            <SelectTrigger
              className="w-full "
              aria-label="تصفية حسب الفئة"
            >
              <SelectValue placeholder="جميع الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
</Field>
          {/* Manufacturer Filter */}
           <Field>
            <FieldLabel className="text-muted-foreground text-xs">الشركة المصنعة</FieldLabel>
          <Select
          dir="rtl"
            value={filters.manufacturer_id}
            onValueChange={(value) => onFilterChange("manufacturer_id", value)}
          >
            <SelectTrigger
              className="w-full"
              aria-label="تصفية حسب الشركة المصنعة"
            >
              <SelectValue placeholder="جميع الشركات المصنعة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الشركات المصنعة</SelectItem>
              {manufacturers?.map((manufacturer) => (
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
          {/* Company Filter */}
           <Field>
            <FieldLabel className="text-muted-foreground text-xs">المورد</FieldLabel>
          <Select
          dir="rtl"
            value={filters.supplier_company_id}
            onValueChange={(value) =>
              onFilterChange("supplier_company_id", value)
            }
          >
            <SelectTrigger
              className="w-full "
              aria-label="تصفية حسب الموردين"
            >
              <SelectValue placeholder="جميع الموردين" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الموردين</SelectItem>
              {suppliersData?.data?.map((supplier: Supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                  {supplier.name}
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
