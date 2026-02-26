import type { SupplierProductsFilters } from "@/types/supplier-products";

export const supplierProductKeys = {
  all: ["supplier-products"] as const,
  lists: () => [...supplierProductKeys.all, "list"] as const,
  list: (filters?: SupplierProductsFilters) =>
    [...supplierProductKeys.lists(), filters] as const,
  details: () => [...supplierProductKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...supplierProductKeys.details(), id] as const,
};

import type { OrdersFilters } from "@/types/orders_cart";

export const supplierOrderKeys = {
  all: ["supplier-orders"] as const,
  lists: () => [...supplierOrderKeys.all, "list"] as const,
  list: (filters?: OrdersFilters) =>
    [...supplierOrderKeys.lists(), filters] as const,
  details: () => [...supplierOrderKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...supplierOrderKeys.details(), id] as const,
};