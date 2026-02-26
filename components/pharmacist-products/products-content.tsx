"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductSearch } from "./products-search";
import type { Product } from "@/types/products";
import type { CartApiResponse, CartItem } from "@/types/orders_cart";
import { DataTable } from "@/components/table/Data-table";
import { createProductsColumns } from "./products-columns";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { getProducts } from "@/lib/products/products.client";
import { getCart } from "@/lib/cart/cart.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { ProductsFilters } from "@/types/filters";

export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      supplier_company_id:
        searchParams.get("supplier_company_id") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}

/** Build a lookup map: product id -> CartItem from the cart response */
export function buildCartMap(cartResponse: CartApiResponse | undefined): Map<number, CartItem> {
  const map = new Map<number, CartItem>();
  if (!cartResponse?.data?.itemsBySupplier) return map;
  for (const group of cartResponse.data.itemsBySupplier) {
    for (const item of group.items) {
      map.set(item.product.id, item);
    }
  }
  return map;
}

export function ProductsContent() {
  const filters = useProductsFiltersFromURL();

  const queryKey = useMemo(() => PRODUCTS_KEYS.list(filters), [filters]);
  const queryFn = useMemo(() => () => getProducts(filters), [filters]);

  // Fetch cart once so we can show quantity controls for items already in cart
  const { data: cartData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  });

  const cartByProductId = useMemo(() => buildCartMap(cartData), [cartData]);

  const columns = useMemo(
    () => createProductsColumns(cartByProductId),
    [cartByProductId]
  );

  return (
    <div className="space-y-6 px-4 lg:px-16 sm:px-12  mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">المنتجات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            تصفح واطلب المنتجات من موردين متعددين
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <ProductSearch />

      {/* Products Table with Pagination */}
      <div className="rounded-lg border bg-card">
        <DataTable<Product> queryKey={queryKey} queryFn={queryFn} columns={columns} />
      </div>
    </div>
  );
}
