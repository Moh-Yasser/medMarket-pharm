"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { CartApiResponse, CartItem } from "@/types/orders_cart";
import { Product } from "@/types/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart/cart.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { useEffect, useRef, useState } from "react";
import { removeCartItemMutation, updateCartItemMutation } from "@/lib/cart/cart-mutate";
import { useDebounce } from "@/hooks/use-debounce";

/* ── Type helpers ─────────────────────────────────────────────────── */

/** Type guard: returns true when the value is a CartItem (has nested .product) */
function isCartItem(p: CartItem | Product): p is CartItem {
  return (
    "product" in p &&
    typeof p.product === "object" &&
    p.product !== null &&
    "stockQuantity" in p.product
  );
}

/** Always returns the *product* id (the one the PHP catalogue knows). */
function getProductId(p: CartItem | Product): number {
  return isCartItem(p) ? p.product.id : p.id;
}

/** Returns the *cart-item* id (used by PUT / DELETE on the cart API). */
function getCartItemId(p: CartItem | Product): number | undefined {
  return isCartItem(p) ? p.id : undefined;
}

/** Safely read stock quantity regardless of shape. */
function getStockQuantity(p: CartItem | Product): number {
  return isCartItem(p)
    ? p.product.stockQuantity ?? 0
    : p.stockQuantity ?? 0;
}

/** Safely read quantity — handles null / undefined / missing field */
function getQuantity(p: CartItem | Product): number {
  if ("quantity" in p && typeof p.quantity === "number") {
    return p.quantity;
  }
  return 0;
}


/* ── Component ────────────────────────────────────────────────────── */

export function CartActions({ product }: { product: CartItem | Product }) {
  const queryClient = useQueryClient();
  const qty = getQuantity(product);
  const productId = getProductId(product);
  const cartItemId = getCartItemId(product);
  const stock = getStockQuantity(product);
  const supplierId = isCartItem(product) ? product.product.supplierCompany.id : product.supplierCompany.id;

  const [draftQty, setDraftQty] = useState(() =>
    qty > 0 ? String(qty) : ""
  );
  const debouncedDraftQty = useDebounce(draftQty, 500);
  const lastSubmittedQtyRef = useRef<number | null>(null);

  useEffect(() => {
    setDraftQty(qty > 0 ? String(qty) : "");
    lastSubmittedQtyRef.current = null;
  }, [qty]);

  function handleError(_err: Error, _newItem: unknown, context: { previousCart: CartApiResponse } | undefined){
    queryClient.setQueryData(CART_KEYS.all, context?.previousCart);
  }
 
  function refreshCart() {
    queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
  }

  function parseDraft(value: string): number | null {
    if (value.trim() === "") return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return null;
    return Math.trunc(parsed);
  }

  function getDraftBase(): number {
    const parsed = parseDraft(draftQty);
    if (parsed == null) return qty;
    return parsed;
  }

  /* Add always uses the product id */
  const addMutation = useMutation({
    mutationFn: (clamped:number = 1) => addCartItem({ product_id: productId, quantity: clamped}),
    onError: (err, newItem, context) => {
      handleError(err, newItem, context as { previousCart: CartApiResponse });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEYS.all, data);
    },
            
  });

  /* Remove always uses the cart-item id */
  const removeMutation = useMutation({
    mutationFn: (id: number) => removeCartItem(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: CART_KEYS.all });
      const previousCart = queryClient.getQueryData(CART_KEYS.all) as CartApiResponse | undefined;
      queryClient.setQueryData(CART_KEYS.all, (old: CartApiResponse | undefined) => {
        return removeCartItemMutation(old, id, supplierId);
      });
      return { previousCart };
    },
    onError: (err, newItem, context) => {
      handleError(err, newItem, context as { previousCart: CartApiResponse });
    },
    
    onSuccess: 
      refreshCart
    
  });



  /* Update always uses the cart-item id */
  const updateMutation = useMutation({
    mutationFn: async (nextQty: number) => {
      return updateCartItem(cartItemId!, { quantity: nextQty });
    },
    onMutate: async (nextQty: number) => {
      await queryClient.cancelQueries({ queryKey: CART_KEYS.all });
      const previousCart = queryClient.getQueryData(CART_KEYS.all) as CartApiResponse | undefined;
      queryClient.setQueryData(CART_KEYS.all, (old: CartApiResponse | undefined) => {
        return updateCartItemMutation(old, productId, supplierId, nextQty);
      });
      return { previousCart };
    },
    onError: (err, newItem, context) => {
      handleError(err, newItem, context as { previousCart: CartApiResponse });
    },
    
    onSuccess: 
      refreshCart
  
  });


  

  function commitQty(rawValue: string) {
    const parsed = parseDraft(rawValue);
    if (parsed == null) {
      setDraftQty(qty > 0 ? String(qty) : "");
      return;
    }

    if (parsed <= 0) {
      setDraftQty("0");
      if (cartItemId == null || qty <= 0) return;
      if (lastSubmittedQtyRef.current === 0) return;
      lastSubmittedQtyRef.current = 0;
      removeMutation.mutate(cartItemId);
      return;
    }

    const clamped = Math.max(1, Math.min(parsed, stock));
    setDraftQty(String(clamped));

    if (clamped === qty || cartItemId == null) return;
    if (lastSubmittedQtyRef.current === clamped) return;

    lastSubmittedQtyRef.current = clamped;
    if (qty <= 0) {
      addMutation.mutate(clamped);
      return;
    }

    updateMutation.mutate(clamped);
  }

  useEffect(() => {
    if (qty <= 0) return;
    commitQty(debouncedDraftQty);
  }, [debouncedDraftQty, qty]);

  /* ── Not in cart → "Add" button ── */
  if (qty <= 0) {
    return (
      <Button
        type="button"
        size="sm"
        disabled={stock === 0 || addMutation.isPending}
        className="gap-1.5"
        onClick={() => addMutation.mutate(1)}
      >
        <ShoppingCart className="h-4 w-4" />
        إضافة
      </Button>
    );
  }

  /* ── In cart → quantity controls ── */
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center rounded-lg border border-border">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          
          onClick={() => {
            const next = Math.max(0, Math.min(getDraftBase() - 1, stock));
            setDraftQty(String(next));
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="text"
          inputMode="numeric"
          value={draftQty}
          
          onChange={(e) => setDraftQty(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={() => commitQty(draftQty)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitQty(draftQty);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="h-8 w-12 rounded-none border-0 px-1 text-center text-sm font-medium shadow-none focus-visible:ring-0"
          aria-label="الكمية"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={  (cartItemId == null)}
          onClick={() => {
            const next = Math.max(1, Math.min(getDraftBase() + 1, stock));
            setDraftQty(String(next));
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
