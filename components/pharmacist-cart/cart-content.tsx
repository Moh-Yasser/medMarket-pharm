"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import CartDetails from "./cart-details";
import { SupplierTabs } from "./supplier-tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { checkoutCart, getCart } from "@/lib/cart/cart.client";
import { Cart, CartApiResponse } from "@/types/orders_cart";
import { useQueryClient } from "@tanstack/react-query";

export function CartContent() {
  const [activeGroup, setActiveGroup] = useState(0);
  const queryClient = useQueryClient();
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { data: fetchedData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  });
  const checkoutMutation= useMutation({
    mutationFn:(supplierId:number)=> checkoutCart(supplierId),
    onSuccess:()=>{
      setOrderSubmitted(true);
    },
    onError:(error)=>{
      setOrderError("فشل في تقديم الطلب");
    },
  });

  const handleSubmitOrder=()=>{
    checkoutMutation.mutate(supplierId);
    queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
  }

  const cartData = fetchedData?.data ?? ({} as Cart);
  const itemsBySupplier = cartData.itemsBySupplier ?? [];
 const supplierId=itemsBySupplier[activeGroup]?.supplier.id;
  
  useEffect(() => {
    if (itemsBySupplier.length > 0 && activeGroup >= itemsBySupplier.length) {
      setActiveGroup(Math.max(0, itemsBySupplier.length - 1));
    }
  }, [itemsBySupplier.length, activeGroup]);


  const safeIndex = itemsBySupplier.length > 0
    ? Math.min(activeGroup, itemsBySupplier.length - 1)
    : 0;
    
    if (orderSubmitted) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
            <ShoppingCart className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">تم تقديم الطلب!</h2>
          <p className="text-muted-foreground mb-6">تم إرسال طلبك بنجاح.</p>
          <Link href="/orders">
            <Button>عرض الطلبات</Button>
          </Link>
        </div>
      )
    }
  /* ── Empty cart ── */
  if (itemsBySupplier.length==0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/80 mb-5">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">سلة التسوق فارغة</h2>
        <p className="text-muted-foreground mb-8 max-w-sm text-center">
          أضف منتجات إلى سلتك لتقديم طلب. تصفح المنتجات المتوفرة من موردين متعددين.
        </p>
        <Link href="/products">
          <Button size="lg" className="gap-2 rounded-xl px-8 font-semibold shadow-md">
            <ArrowRight className="h-4 w-4" />
            تصفح المنتجات
          </Button>
        </Link>
      </div>
    );
  }

  /* ── Cart with items ── */
  return (
    <div className="space-y-6 lg:px-16 sm:px-6 px-4 py-4 mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">سلة التسوق</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {itemsBySupplier.length > 1
              ? `${itemsBySupplier.length} موردين  ${cartData.suppliersCount ?? itemsBySupplier.length} طلبات`
              : "مورد واحد"}
          </p>
        </div>
      </div>

      {/* Supplier tabs */}
      <SupplierTabs
        activeGroup={safeIndex}
        onSelect={setActiveGroup}
        CartItems={itemsBySupplier}
      />

      {/* Cart details for selected supplier */}
      <CartDetails groupData={itemsBySupplier[safeIndex]} handleSubmitOrder={handleSubmitOrder} orderError={orderError} isLoading={checkoutMutation.isPending}/>
    </div>
  );
}
