import axios from "axios";
import { AxiosApi, handleAxiosError } from "@/lib/api/nextBff.client";
import { createQueryString } from "@/lib/api/queryString";

const ORDERS_ROUTE = "/api/pharmacist/orders";

import type { OrdersFilters, OrdersApiResponse, OrderDetailResponse } from "@/types/orders_cart";

export async function getOrders(
  filters?: OrdersFilters,
): Promise<OrdersApiResponse> {
  try {
    
    const queryString = createQueryString(filters);
    const url = queryString ? `${ORDERS_ROUTE}?${queryString}` : ORDERS_ROUTE;

    const response = await AxiosApi.get<OrdersApiResponse>(url);
    return response.data;
  } catch (error) {
  handleAxiosError(error);
  }
}

export async function fetchOrderDetail(id: string | number): Promise<OrderDetailResponse> {
  try {
    const { data } = await AxiosApi.get<OrderDetailResponse>(`${ORDERS_ROUTE}/${id}`)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || error.message)
    }
    throw error
  }
}