import { phpFetch } from "@/lib/api/php.server";
import type { ManufacturersApiResponse } from "@/types/filters";

const MANUFACTURERS_PATH = "/manufacturers";

export async function getAllManufacturers(): Promise<ManufacturersApiResponse> {
  return phpFetch<ManufacturersApiResponse>(MANUFACTURERS_PATH, {
    method: "GET",
  });
}
