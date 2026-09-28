"use client";

import { SupplierInfo } from "./supplier-details-info";
import { SupplierInfoLoading } from "./supplier-details-info-loading";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getSupplier } from "@/lib/suppliers/suppliers.client";
import { Supplier, SupplierApiResponse } from "@/types/company";
import { Product, ProductsApiResponse } from "@/types/products";
import { useMemo } from "react";
import { CartApiResponse } from "@/types/orders_cart";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { getCart } from "@/lib/cart/cart.client";
import { getSupplierProducts } from "@/lib/products/products.client";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { buildCartMap } from "../pharmacist-products/products-content";
import { ProductsFilters } from "@/types/filters";
import { useSearchParams } from "next/navigation";
import { ProductsList } from "../pharmacist-products/products-list";
import { ProductsSearch } from "./supplier-details-search";

export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}

export function SupplierContent({ supplierId }: { supplierId: string }) {
  const filters = useProductsFiltersFromURL();
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category_id !== "all" ||
    filters.manufacturer_id !== "all" 

  const {
    data: fetchedData,
    isLoading: isSupplierLoading,
    isFetching: isSupplierFetching,
  } = useQuery<SupplierApiResponse>({
    queryKey: SUPPLIERS_KEYS.detail(supplierId),
    queryFn: () => getSupplier(supplierId),
  });
  const supplier: Supplier = fetchedData?.data ?? ({} as Supplier);

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
      getSupplierProducts(supplierId,{ ...filters, page: pageParam as number }),
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
      {isSupplierLoading || isSupplierFetching ? (
        <SupplierInfoLoading />
      ) : (
        <SupplierInfo supplier={supplier} />
      )}

      <ProductsSearch
        categories={supplier.category}
        manufacturers={supplier.manufacturer}
      />
     <ProductsList 
     hasFilters={hasActiveFilters}
       products={products}
        cartsItemsByProductId={cartsItemsByProductId}
        status={status}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        hasFatalError={hasFatalError}
        fetchNextPage={fetchNextPage}
        onRetry={handleRetry}/>
    </div>
  );
}
