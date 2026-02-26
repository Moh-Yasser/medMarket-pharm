import { SuppliersFilters } from "@/types/filters";

export const SUPPLIERS_KEYS = {
  all: ["suppliers"] as const,
  lists: () => [...SUPPLIERS_KEYS.all, "list"] as const,
  list: (filters?: SuppliersFilters) => [...SUPPLIERS_KEYS.lists(), filters] as const,
  details: () => [...SUPPLIERS_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...SUPPLIERS_KEYS.details(), id] as const,
} as const;

