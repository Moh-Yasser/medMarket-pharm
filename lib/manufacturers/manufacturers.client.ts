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
  handleAxiosError(error);
  }
}
