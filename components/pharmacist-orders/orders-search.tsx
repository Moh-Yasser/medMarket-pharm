"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";  
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
import { OrdersFilters, OrderStatus } from "@/types/orders_cart";
import { createQueryString } from "@/lib/api/queryString";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { Supplier } from "@/types/company";

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "accepting", label: "جار القبول" },
  { value: "prepared", label: "تم التحضير" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
];


function getFiltersFromParams(params: URLSearchParams): OrdersFilters {
  return {
    supplier: params.get("supplier") || undefined,
    status: params.get("status") as OrderStatus | "all" || undefined ,
  };
}


export function OrderSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<OrdersFilters>(() => getFiltersFromParams(searchParams));
  const { data: suppliersData } = useQuery({
    queryKey: SUPPLIERS_KEYS.all,
    queryFn: () => getAllSuppliers(),
  });

  const queryString = createQueryString<OrdersFilters>(filters);
  const debouncedQuery = useDebounce(queryString, 500);

  const lastSyncedRef = useRef(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedQuery;
      replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`);
    }
  }, [debouncedQuery, pathname, replace]);

  const hasActiveFilters = 
      (filters.supplier !== undefined && filters.supplier !== "all") ||
      (filters.status !== undefined && filters.status !== "all");
   

  const onFilterChange = (key: keyof OrdersFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const onClearFilters = () => {
    setFilters({
      supplier: "all",
      status: "all",
    });
  };


  return (
    <div className=" flex flex-wrap items-center gap-3">
     
        <Select
          value={filters.supplier}
          onValueChange={(value) => onFilterChange("supplier", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الفئة">
            <SelectValue placeholder="جميع الشركات الموردة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الشركات الموردة</SelectItem>
            {suppliersData?.data?.map((supplier: Supplier) => (
              <SelectItem key={supplier.id} value={String(supplier.id)}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Company Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الحالة">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground "
            aria-label="مسح جميع الفلاتر"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>مسح</span>
          </Button>
        )}
      </div>
    
  );
}
