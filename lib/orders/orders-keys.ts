import type { OrdersFilters } from "@/types/orders_cart";

export const ORDERS_KEYS = {
  all: ["pharmacist-orders"] as const,
  lists: () => [...ORDERS_KEYS.all, "list"] as const,
  list: (filters?: OrdersFilters) =>
    [...ORDERS_KEYS.lists(), filters] as const,
  details: (id: string | number) =>
    [...ORDERS_KEYS.lists(), id] as const,
};

