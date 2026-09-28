import { ProductsFilters } from "@/types/filters";

export const PRODUCTS_KEYS = {
    all: ["all-products"] as const,
    lists: () => [...PRODUCTS_KEYS.all, "list"] as const,
    list: (filters?: ProductsFilters) =>
      [...PRODUCTS_KEYS.lists(), filters] as const,
    details: (id: string | number) =>
    [...PRODUCTS_KEYS.lists(), id] as const
  } as const;