import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";
import type { SupplierApiResponse, SuppliersApiResponse } from "@/types/company";
import type { SuppliersFilters } from "@/types/filters";
import { createQueryString } from "@/lib/api/queryString";
  
const SUPPLIERS_ROUTE = "/api/pharmacist/suppliers";


export async function getAllSuppliers(
  filters?: SuppliersFilters,
): Promise<SuppliersApiResponse> {
  try {
    const queryString = createQueryString(filters);
    const url = queryString ? `${SUPPLIERS_ROUTE}?${queryString}` : SUPPLIERS_ROUTE;

    const response = await AxiosApi.get<SuppliersApiResponse>(url);
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

export async function getSupplier(id: string): Promise<SupplierApiResponse> {
  try {
    const response = await AxiosApi.get<SupplierApiResponse>(`${SUPPLIERS_ROUTE}/${id}`);
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

