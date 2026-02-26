"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CartApiResponse, CartItem } from "@/types/orders_cart";
import { removeCartItem } from "@/lib/cart/cart.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CART_KEYS } from "@/lib/cart/cart-keys";

export function TrashButton({ product }: { product: CartItem }) {
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: () => removeCartItem(product.id),
    onSuccess: (response: CartApiResponse) => {
      queryClient.setQueryData(CART_KEYS.all, response);
    },
  });

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={removeMutation.isPending}
      onClick={() => removeMutation.mutate()}
    >
      {removeMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
