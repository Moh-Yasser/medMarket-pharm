"use client"

import { useMemo  } from "react"
import { useSearchParams } from "next/navigation"
import { OrderSearch } from "./orders-search"
import { DataTable } from "@/components/table/Data-table"
import { Order, OrdersFilters, OrderStatus } from "@/types/orders_cart"
import { pharmacistOrderKeys } from "@/lib/pharmacist-orders/pharmacist-orders-keys"
import {OrdersColumns} from "./orders-columns"
import { getOrders } from "@/lib/pharmacist-orders/pharmacist-orders.client"


function useOrdersFiltersFromURL(): OrdersFilters {
  const searchParams = useSearchParams();

  return useMemo<OrdersFilters>(() => {
    const supplierParam = searchParams.get("supplier");
    const statusParam = searchParams.get("status");

    return {
      supplier: supplierParam && supplierParam !== "all" ? supplierParam : undefined,
      status:
        statusParam && statusParam !== "all"
          ? (statusParam as OrderStatus)
          : undefined,
    };
  }, [searchParams]);
}

export default function OrdersContent() {
 const filters = useOrdersFiltersFromURL();

const queryKey = useMemo(() => 
  pharmacistOrderKeys.list(filters), 
[filters]);

const queryFn = useMemo(() => 
  () => getOrders(filters), 
[filters]);

  return (
    <div className="space-y-6 px-4 lg:px-8 sm:px-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">الطلبات</h1>
        <p className="text-sm text-muted-foreground mt-1">تتبع وأدر جميع طلباتك في مكان واحد</p>
      </div>
      <OrderSearch />

{/* Products Table with Pagination */}
<div className="rounded-lg border bg-card">
  <DataTable<Order> queryKey={queryKey} queryFn={queryFn} columns={OrdersColumns} />
    
</div>
     
    </div>
  )
}
