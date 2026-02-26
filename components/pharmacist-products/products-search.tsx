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
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductsFilters } from "@/types/filters";
import { createQueryString } from "@/lib/api/queryString";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.client";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { Supplier } from "@/types/company";



function getFiltersFromParams(params: URLSearchParams): ProductsFilters {
  return {
    search: params.get("search") || "",
    category_id: params.get("category_id") || "all",
    manufacturer_id: params.get("manufacturer_id") || "all",
    supplier_company_id: params.get("supplier_company_id") || "all",
    page: parseInt(params.get("page") || "1", 10) ,
    per_page: parseInt(params.get("per_page") || "15", 10) ,
  };
}



export function ProductSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<ProductsFilters>(() => getFiltersFromParams(searchParams));
  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllCategories,
  });
  const { data: manufacturersData } = useQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllManufacturers,
  });
  const { data: suppliersData } = useQuery({
    queryKey: SUPPLIERS_KEYS.list(filters),
    queryFn: () => getAllSuppliers(filters),
  });

  const queryString = createQueryString<ProductsFilters>(filters);
  const debouncedQuery = useDebounce(queryString, 800);
  const [isOpen,setIsOpen]=useState<boolean>(false);  
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
    filters.supplier_company_id !== "all" 
    

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
          aria-expanded={hasActiveFilters}
          aria-controls="filters-panel"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
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
        className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4"
      >
        {/* Category Filter */}
        <Select
          value={filters.category_id}
          onValueChange={(value) => onFilterChange("category_id", value)}
        >
          <SelectTrigger className="w-full sm:w-[190px]" aria-label="تصفية حسب الفئة">
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
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الشركة المصنعة">
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

        {/* Company Filter */}
        <Select
          value={filters.supplier_company_id}
          onValueChange={(value) => onFilterChange("supplier_company_id", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الشركة">
            <SelectValue placeholder="جميع الموردين" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الموردين</SelectItem>
            {suppliersData?.data?.map((supplier:Supplier) => (
              <SelectItem key={supplier.id} value={String(supplier.id)}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
      )}
    </div>
  );
}
