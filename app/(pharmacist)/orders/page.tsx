"use server"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { OrdersFilters, OrderStatus } from "@/types/orders_cart";
import OrdersContent from "@/components/pharmacist-orders/orders-content"
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.server";
import { ORDERS_KEYS } from "@/lib/orders/orders-keys";
import { GetOrders } from "@/lib/orders/orders.server";
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: OrdersFilters = {
    supplier: typeof params.supplier === "string" ? params.supplier : undefined,
    status: typeof params.status === "string" ? params.status as OrderStatus : undefined,
  };

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ORDERS_KEYS.list(filters),
    queryFn: () => GetOrders(filters),
  });
  await queryClient.query({
    queryKey: SUPPLIERS_KEYS.all,
    queryFn: () => getAllSuppliers(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersContent />
    </HydrationBoundary>
  );
}
