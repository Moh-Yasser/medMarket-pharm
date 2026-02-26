"use client"

import { SupplierInfo } from "./supplier-details-info";
import { SupplierInfoLoading } from "./supplier-details-info-loading";
import { useQuery } from "@tanstack/react-query";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getSupplier } from "@/lib/suppliers/suppliers.client";
import { Supplier, SupplierApiResponse } from "@/types/company";
import { SupplierProductSearch } from "./supplier-products-search";
import { DataTable } from "../table/Data-table";
import { Product } from "@/types/products";
import {createProductsColumns} from "../pharmacist-products/products-columns"
import { useMemo } from "react";
import { CartApiResponse } from "@/types/orders_cart";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { getCart } from "@/lib/cart/cart.client";
import { getSupplierProducts } from "@/lib/products/products.client";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { buildCartMap } from "../pharmacist-products/products-content";
import { ProductsFilters } from "@/types/filters";
import { useSearchParams } from "next/navigation";


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

    const { data: fetchedData, isLoading: isSupplierLoading, isFetching: isSupplierFetching } = useQuery<SupplierApiResponse>({
        queryKey: SUPPLIERS_KEYS.detail(supplierId),
        queryFn: () => getSupplier(supplierId),
    });
    const supplier: Supplier = fetchedData?.data ?? {} as Supplier;
 
  const filters = useProductsFiltersFromURL();

  const queryKey = useMemo(() => PRODUCTS_KEYS.list(filters), [filters]);
  const queryFn = useMemo(() => () => getSupplierProducts(supplierId, filters), [supplierId, filters]);

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
            {isSupplierLoading || isSupplierFetching ? <SupplierInfoLoading /> : <SupplierInfo supplier={supplier} />}
            
            <SupplierProductSearch categories={supplier.category} manufacturers={supplier.manufacturer} />
            <div className="rounded-lg border bg-card">
        <DataTable<Product> queryKey={queryKey} queryFn={queryFn} columns={columns} />
      </div>
        </div>
    )
}