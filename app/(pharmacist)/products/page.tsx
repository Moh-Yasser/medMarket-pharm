import { ProductsContent } from "@/components/pharmacist-products/products-content";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { ProductsFilters } from "@/types/filters";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { GetProducts } from "@/lib/products/products.server";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.server";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.server";
import { SUPPLIERS_KEYS } from "@/lib/suppliers/suppliers-keys";
import { getAllSuppliers } from "@/lib/suppliers/suppliers.server";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: ProductsFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    category_id: typeof params.category_id === "string" ? params.category_id : undefined,
    manufacturer_id:
      typeof params.manufacturer_id === "string" ? params.manufacturer_id : undefined,
    supplier_company_id:
      typeof params.supplier_company_id === "string"
        ? params.supplier_company_id
        : undefined,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: PRODUCTS_KEYS.list(filters),
    queryFn: () => GetProducts(filters),
  });
  await queryClient.prefetchQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllCategories,
  });
  await queryClient.prefetchQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllManufacturers,
  });
  await queryClient.prefetchQuery({
    queryKey: SUPPLIERS_KEYS.all,
    queryFn: () => getAllSuppliers(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsContent />
    </HydrationBoundary>
  );
}
