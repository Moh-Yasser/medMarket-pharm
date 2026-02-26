import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";
import type { ManufacturersApiResponse } from "@/types/filters";

const MANUFACTURERS_ROUTE = "/api/pharmacist/manufacturers";

export async function getAllManufacturers(): Promise<ManufacturersApiResponse> {
  try {
    const response =
      await AxiosApi.get<ManufacturersApiResponse>(MANUFACTURERS_ROUTE);
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
