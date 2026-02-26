import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";
import { createQueryString } from "@/lib/api/queryString";

const ORDERS_ROUTE = "/api/pharmacist/orders";

import type { OrdersFilters, OrdersApiResponse } from "@/types/orders_cart";

export async function getOrders(
  filters?: OrdersFilters,
): Promise<OrdersApiResponse> {
  try {
    
    const queryString = createQueryString(filters);
    const url = queryString ? `${ORDERS_ROUTE}?${queryString}` : ORDERS_ROUTE;

    const response = await AxiosApi.get<OrdersApiResponse>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Request failed";
      throw new Error(message);
    }
    throw error;
  }
}