"use server"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { GetOrders } from "@/lib/pharmacist-orders/pharmacist-orders.server";
import { OrdersFilters, OrderStatus } from "@/types/orders_cart";
import OrdersContent from "@/components/pharmacist-orders/orders-content"
import { pharmacistOrderKeys } from "@/lib/pharmacist-orders/pharmacist-orders-keys";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.server";
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

  await queryClient.prefetchQuery({
    queryKey: pharmacistOrderKeys.list(filters),
    queryFn: () => GetOrders(filters),
  });
  await queryClient.prefetchQuery({
    queryKey: SUPPLIERS_KEYS.all,
    queryFn: () => getAllSuppliers(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersContent />
    </HydrationBoundary>
  );
}
