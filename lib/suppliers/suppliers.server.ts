import { phpFetch } from "@/lib/api/php.server";
import type { SuppliersApiResponse } from "@/types/company";
import { SuppliersFilters } from "@/types/filters";

const SUPPLIERS_PATH = "/companies?type=supplier";
export async function getAllSuppliers(filters?: SuppliersFilters): Promise<SuppliersApiResponse> {
  return phpFetch<SuppliersApiResponse>(SUPPLIERS_PATH, { method: "GET" });
}
