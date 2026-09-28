"use client";

import { Building2, CalendarIcon, ListFilter, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { OrdersFilters, OrderStatus } from "@/types/orders_cart";
import { createQueryString } from "@/lib/api/queryString";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { useQuery } from "@tanstack/react-query";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.client";
import { Supplier, SuppliersApiResponse } from "@/types/company";

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "accepted", label: "تمت الموافقة" },
  { value: "prepared", label: "تم التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
];

function parseDateParam(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getFiltersFromParams(params: URLSearchParams): OrdersFilters {
  return {
    supplier: params.get("supplier") || undefined,
    status: (params.get("status") as OrderStatus) || undefined,
    from_date: params.get("from_date") || undefined,
    to_date: params.get("to_date") || undefined,
    page:parseInt(params.get("page") || "1", 10)
  };
}

function dateButtonClass(hasValue: boolean) {
  return cn(
    "flex justify-start gap-2 text-start font-normal ",
    !hasValue && "text-muted-foreground",
  );
}

export function OrderSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<OrdersFilters>(() =>
    getFiltersFromParams(searchParams),
  );

  const { data: suppliersData } = useQuery<SuppliersApiResponse>({
    queryKey: SUPPLIERS_KEYS.list(),
    queryFn: () => getAllSuppliers(),
  });

  const queryString = createQueryString<OrdersFilters>(filters);

  useEffect(() => {
      replace(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }, [queryString, pathname, replace]);

  const fromDate = parseDateParam(filters.from_date);
  const toDate = parseDateParam(filters.to_date);

  const hasActiveFilters =
    Boolean(filters.supplier) ||
    filters.status !== undefined ||
    Boolean(filters.from_date) ||
    Boolean(filters.to_date);

  const onClearFilters = () => {
    setFilters({
      supplier: undefined,
      status: undefined,
      from_date: "",
      to_date: "",
      page:1,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg border bg-card p-3 sm:grid-cols-2 ">
      {/* Category filters: paired 2-up on mobile, inline from sm */}
      <div className="grid grid-cols-1 gap-2 w-full xs:grid-cols-2">
        <Select
          dir="rtl"
          value={filters.supplier || "all"}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              supplier: val === "all" ? undefined : val,
            }))
          }
        >
          <SelectTrigger className="w-full gap-2 " aria-label="تصفية حسب الموردين">
            <span className="flex min-w-0 items-center gap-2">
              <Building2 size={14} className="shrink-0 text-muted-foreground" />
              <SelectValue placeholder="جميع الموردين" />
            </span>
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

        <Select
          dir="rtl"
          value={filters.status || "all"}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              status: val === "all" ? undefined : (val as OrderStatus),
            }))
          }
        >
          <SelectTrigger className="w-full gap-2 " aria-label="تصفية حسب الحالة">
            <span className="flex min-w-0 items-center gap-2">
              <ListFilter size={14} className="shrink-0 text-muted-foreground" />
              <SelectValue placeholder="جميع الحالات" />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date range: the two ends of one range, so they travel as a pair */}
      <div className="grid grid-cols-2 gap-2 w-full ">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={dateButtonClass(Boolean(fromDate))} type="button">
              <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
              <span className="truncate">
                {fromDate ? format(fromDate, "PPP", { locale: ar }) : "من تاريخ"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) =>
                setFilters((prev) => {
                  const prevTo = parseDateParam(prev.to_date);
                  const toStillValid = !date || !prevTo || prevTo.getTime() >= date.getTime();
                  return {
                    ...prev,
                    from_date: date ? format(date, "M/d/yyyy") : "",
                    to_date: toStillValid ? prev.to_date : "",
                  };
                })
              }
              locale={ar}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={dateButtonClass(Boolean(toDate))} type="button">
              <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
              <span className="truncate">
                {toDate ? format(toDate, "PPP", { locale: ar }) : "إلى تاريخ"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  to_date: date ? format(date, "M/d/yyyy") : "",
                }))
              }
              locale={ar}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          onClick={onClearFilters}
          className="w-full gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:w-auto sm:ms-auto"
          aria-label="مسح جميع الفلاتر"
        >
          <Trash className="h-4 w-4" aria-hidden="true" />
          <span>مسح الكل</span>
        </Button>
      )}
    </div>
  );
}