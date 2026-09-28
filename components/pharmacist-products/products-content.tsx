"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ProductsSearch } from "./products-search";
import { ProductsApiResponse, type Product } from "@/types/products";
import type { CartApiResponse, CartItem } from "@/types/orders_cart";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { getProducts } from "@/lib/products/products.client";
import { getCart } from "@/lib/cart/cart.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { Category, Manufacturer, ProductsFilters } from "@/types/filters";
import { ProductsList } from "./products-list";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.client";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client";

export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      supplier_company_id: searchParams.get("supplier_company_id") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}

export function buildCartMap(
  cartResponse: CartApiResponse | undefined,
): Map<number, CartItem> {
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

 const hasActiveFilters =
    filters.search !== "" ||
    filters.category_id !== "all" ||
    filters.manufacturer_id !== "all" ||
    filters.supplier_company_id !== "all";

     


  const {
    data: fetchedProducts,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    status,
  } = useInfiniteQuery<ProductsApiResponse>({
    queryKey: PRODUCTS_KEYS.list(filters),
    queryFn: ({ pageParam }) =>
      getProducts({ ...filters, page: pageParam as number }),
    initialPageParam: filters.page ?? 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  const { data: cartData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  });

    const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllManufacturers,
  });

const categories=categoriesData?.data ?? [] as Category[];

  const { data: manufacturersData } = useQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllCategories,
  });

  const manufacturers=manufacturersData?.data ?? [] as Manufacturer[];

  const cartsItemsByProductId = useMemo(
    () => buildCartMap(cartData),
    [cartData],
  );

  const products =
    fetchedProducts?.pages.flatMap((page) => page.data) ?? ([] as Product[]);

  const hasFatalError = status === "error" && !fetchedProducts;

  const handleRetry = () => {
    void (isFetchNextPageError ? fetchNextPage() : refetch());
  };

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
      <ProductsSearch
       manufacturers={manufacturers}
      categories={categories}
      />

      <ProductsList
     hasFilters={ hasActiveFilters}
        products={products}
        cartsItemsByProductId={cartsItemsByProductId}
        status={status}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        hasFatalError={hasFatalError}
        fetchNextPage={fetchNextPage}
        onRetry={handleRetry}
      />
    </div>
  );
}
