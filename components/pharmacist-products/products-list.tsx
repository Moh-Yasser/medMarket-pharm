"use client";

import { Loader2 } from "lucide-react";
import type { CartItem } from "@/types/orders_cart";
import type { Product } from "@/types/products";
import { useInfiniteScrollTrigger } from "@/hooks/use-infinite-scroll-trigger";
import ProductCard from "./product-card";
import { ProductCardSkeletonList } from "./products-card-skeleton";
import { ProductsError } from "./products-error";
import { ProductsEmpty } from "./products-empty";

const GRID_CLASSES =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

type ProductsListProps = {
  products: Product[];
  cartsItemsByProductId: Map<number, CartItem>;
  status: "pending" | "error" | "success";
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  hasFatalError: boolean;
  fetchNextPage: () => void;
  onRetry: () => void;
  hasFilters:boolean
};

export function ProductsList({
  products,
  cartsItemsByProductId,
  status,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  hasFatalError,
  fetchNextPage,
  onRetry,
  hasFilters
}: ProductsListProps) {
  const isInitialLoading = status === "pending";
  const isEmpty = status === "success" && products.length === 0;

  const loadMoreRef = useInfiniteScrollTrigger({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetching && status !== "error",
  });

  if (hasFatalError) {
    return <ProductsError onRetry={onRetry} />;
  }

  return (
    <>
      {isInitialLoading && (
        <p role="status" className="sr-only">
          جارٍ تحميل المنتجات
        </p>
      )}

      {isEmpty ? (
        <ProductsEmpty hasFilters={hasFilters}/>
      ) : (
        <div
          className={GRID_CLASSES}
          aria-busy={isInitialLoading || isFetchingNextPage}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartsItems={cartsItemsByProductId}
            />
          ))}

          {isInitialLoading && <ProductCardSkeletonList count={8} />}
        </div>
      )}

      {isFetchingNextPage && (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground"
        >
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          جارٍ تحميل المزيد...
        </div>
      )}

      {/* Next-page / refetch failure: keep the loaded products, offer retry */}
      {status === "error" && !isFetching && (
        <ProductsError compact onRetry={onRetry} />
      )}

      {/* Infinite scroll sentinel */}
      {hasNextPage && status !== "error" && (
        <div ref={loadMoreRef} aria-hidden="true" className="h-px" />
      )}
    </>
  );
}