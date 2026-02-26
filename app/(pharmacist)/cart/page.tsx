"use server"
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getCart } from "@/lib/cart/cart.server";
import { CartContent } from "@/components/pharmacist-cart/cart-content";
import { CART_KEYS } from "@/lib/cart/cart-keys";

export default async function CartPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: CART_KEYS.all,
    queryFn: () => getCart(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
   <CartContent/>
   </HydrationBoundary>
  )
}

