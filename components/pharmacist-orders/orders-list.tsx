"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Order,
  OrdersApiResponse,
  OrdersFilters,
  OrderStatus,
} from "@/types/orders_cart";
import { OrderCard } from "./order-card";
import { OrdersView } from "./orders-view-toggle";
import { PaginationType } from "@/types/api-response";
import { createQueryString } from "@/lib/api/queryString";

interface OrdersListProps {
  ordersFetched: OrdersApiResponse | undefined;
  onOrderClick?: (order: Order) => void;
  pageSize?: number;
  view?: OrdersView;
}

function getFiltersFromParams(params: URLSearchParams): OrdersFilters {
  return {
    supplier: params.get("supplier") || undefined,
    status: (params.get("status") as OrderStatus) || undefined,
    from_date: params.get("from_date") || undefined,
    to_date: params.get("to_date") || undefined,
    page: parseInt(params.get("page") || "1", 10),
  };
}

export function OrdersList({
  ordersFetched,
  onOrderClick,
  pageSize = 9,
  view = "grid",
}: OrdersListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<OrdersFilters>(() =>
    getFiltersFromParams(searchParams),
  );

  const queryString = createQueryString<OrdersFilters>(filters);
  useEffect(() => {
    replace(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }, [queryString, pathname, replace]);

  const orders = useMemo(
    () => ordersFetched?.data ?? ([] as Order[]),
    [ordersFetched],
  );


  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <Inbox className="text-muted-foreground" size={28} />
        <div>
          <p className="font-medium text-foreground">لا توجد طلبات</p>
          <p className="mt-1 text-sm text-muted-foreground">
            لم تقم بإنشاء أي طلبات بعد، أو لا توجد نتائج مطابقة لبحثك
          </p>
        </div>
      </div>
    );
  }

  const { currentPage, lastPage: totalPages } =
    ordersFetched?.pagination ?? ({} as PaginationType);
  const containerClass =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      : "flex flex-col gap-3";

  return (
    <div className="space-y-6">
      <div className={containerClass}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={onOrderClick} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setFilters((prev) => ({
      ...prev,page:Math.max(1, prev.page - 1)
    }))}
          >
            <ChevronRight size={16} />
            السابق
          </Button>
          <p className="text-sm text-muted-foreground">
            الصفحة {currentPage} من {totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setFilters((prev) => ({
      ...prev,page: Math.min(totalPages, prev.page + 1 )}))}
          >
            التالي
            <ChevronLeft size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
