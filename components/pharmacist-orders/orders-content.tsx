"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { OrderSearch } from "./orders-search"
import { OrdersSkeleton } from "./orders-skeleton"
import { OrdersError } from "./orders-error"
import { OrdersList } from "./orders-list"
import { OrdersView, OrdersViewToggle } from "./orders-view-toggle"
import { OrdersFilters, OrderStatus } from "@/types/orders_cart"
import { ORDERS_KEYS } from "@/lib/orders/orders-keys"
import { getOrders } from "@/lib/orders/orders.client"

function useOrdersFiltersFromURL(): OrdersFilters {
  const searchParams = useSearchParams();

  return useMemo<OrdersFilters>(() => {
    return {
      supplier: searchParams.get("supplier") || undefined,
      status: searchParams.get("status") as OrderStatus|| undefined,
      from_date: searchParams.get("from_date")||undefined,
      to_date: searchParams.get("to_date")||undefined,
      page:parseInt(searchParams.get("page") || "1", 10),
    };
  }, [searchParams]);
}

export default function OrdersContent() {
  const filters = useOrdersFiltersFromURL();
  const router = useRouter();
  const [view, setView] = useState<OrdersView>("grid");

  const queryKey = useMemo(() =>
  ORDERS_KEYS.list(filters),
  [filters]);

  const { data: fetchedOrders, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => getOrders(filters),
  });

  return (
    <div className="space-y-6 px-4 lg:px-8 sm:px-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">الطلبات</h1>
        <p className="text-sm text-muted-foreground mt-1">تتبع وأدر جميع طلباتك في مكان واحد</p>
      </div>

    
        <div className="min-w-60 flex-1">
          <OrderSearch />
        </div>
        <OrdersViewToggle view={view} onChange={setView} />
  

      {isLoading ? (
        <OrdersSkeleton view={view} />
      ) : isError ? (
        <OrdersError onRetry={refetch} />
      ) : (
        <OrdersList
          ordersFetched={fetchedOrders}
          view={view}
          onOrderClick={(order) => router.push(`/orders/${order.id}`)}
        />
      )}
    </div>
  )
}