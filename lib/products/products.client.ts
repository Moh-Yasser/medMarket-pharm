import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";
import { createQueryString } from "@/lib/api/queryString";
import type { ProductsApiResponse } from "@/types/products";
import type { ProductsFilters } from "@/types/filters";

const PRODUCTS_ROUTE = "/api/pharmacist/products";

export async function getProducts(
  filters?: ProductsFilters,
): Promise<ProductsApiResponse> {
  try {
    
    const queryString = createQueryString(filters);
    const url = queryString ? `${PRODUCTS_ROUTE}?${queryString}` : PRODUCTS_ROUTE;

    const response = await AxiosApi.get<ProductsApiResponse>(url);
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

export async function getSupplierProducts(
  supplierId: string,
  filters?: ProductsFilters,
): Promise<ProductsApiResponse> {
  try {
    const queryString = createQueryString({...filters, supplier_company_id: supplierId});
    const url = queryString ? `${PRODUCTS_ROUTE}?${queryString}` : PRODUCTS_ROUTE;

    const response = await AxiosApi.get<ProductsApiResponse>(url);
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