import type { OrdersFilters } from "@/types/orders_cart";

export const pharmacistOrderKeys = {
  all: ["pharmacist-orders"] as const,
  lists: () => [...pharmacistOrderKeys.all, "list"] as const,
  list: (filters?: OrdersFilters) =>
    [...pharmacistOrderKeys.lists(), filters] as const,
  details: () => [...pharmacistOrderKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...pharmacistOrderKeys.details(), id] as const,
};

