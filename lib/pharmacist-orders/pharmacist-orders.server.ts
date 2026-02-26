import { createQueryString } from "@/lib/api/queryString";
import { phpFetch } from "@/lib/api/php.server";
import type {  OrdersApiResponse, OrdersFilters } from "@/types/orders_cart";

const ORDERS_PATH = "/orders";

export async function GetOrders(
  filters?: OrdersFilters,
): Promise<OrdersApiResponse> {
  const queryString = createQueryString(filters);
  const path = queryString ? `${ORDERS_PATH}?${queryString}` : ORDERS_PATH;

  return phpFetch<OrdersApiResponse>(path, { method: "GET" });
}


