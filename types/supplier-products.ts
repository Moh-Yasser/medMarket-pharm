import type { Product } from "./products";


export interface SupplierProductsFilters {
  search?: string;
  category?: string;
  warehouse?: string;
  page?: number;
  per_page?: number;
}



