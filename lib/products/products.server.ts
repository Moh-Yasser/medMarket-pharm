import { createQueryString } from "@/lib/api/queryString";
import { phpFetch } from "@/lib/api/php.server";
import type {  ApiResponse } from "@/types/api-response";
import type { Product } from "@/types/products";
import type { ProductsFilters } from "@/types/filters";

export type ProductsApiResponse = ApiResponse<Product>;

const PRODUCTS_PATH = "/products";

export async function GetProducts(
  filters?: ProductsFilters,
): Promise<ProductsApiResponse> {
  const queryString = createQueryString(filters);
  const path = queryString ? `${PRODUCTS_PATH}?${queryString}` : PRODUCTS_PATH;

  return phpFetch<ProductsApiResponse>(path, { method: "GET" });
}
