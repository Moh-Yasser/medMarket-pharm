"use client"

import { useState } from "react"
import {
  Package,
  Percent,
  Gift,
  CalendarDays,
  Check,
  Tag,
  ShoppingCart,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/store/dialog-store"
import { ProductOffer } from "@/types/Offer"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCartItem, updateCartItem } from "@/lib/cart/cart.client"
import { CART_KEYS } from "@/lib/cart/cart-keys"
import type { CartApiResponse } from "@/types/orders_cart"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */





/** Build display-ready details for each offer */
function getOfferDetails(offer: ProductOffer) {
  const { quantityRequired, quantityFree, discountValue } = offer

  if (offer.offerType === "buy_x_get_y") {
    return {
      type: "buy_get" as const,
      label: `اشترِ ${quantityRequired} واحصل على ${quantityFree} مجاناً`,
      tagLabel: "هدية مجانية",
      highlight: `+${quantityFree} مجاناً`,
    }
  }

  return {
    type: "percentage" as const,
    label: `اشترِ ${quantityRequired} واحصل على خصم ${discountValue}%`,
    tagLabel: `خصم ${discountValue}%`,
    highlight: `${discountValue}% خصم`,
  }
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
} 


export function OfferDialog() {
  const offerDialogStatus = useDialogStore((state) => state.offerDialogStatus)
  const product = useDialogStore((state) => state.product)
  const setCloseOffers = useDialogStore((state) => state.setCloseOffers)
  const queryClient = useQueryClient()

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null)

  const offers: ProductOffer[] = product?.offers ?? []

  /** Find existing CartItem for this product inside the cached cart */
  function findCartItem() {
    const cached = queryClient.getQueryData<CartApiResponse>(CART_KEYS.all)
    if (!cached?.data?.itemsBySupplier) return undefined
    for (const group of cached.data.itemsBySupplier) {
      const found = group.items.find((i) => i.product.id === product?.id)
      if (found) return found
    }
    return undefined
  }

  const applyOfferMutation = useMutation({
    mutationFn: async () => {
      const offer = offers.find((o) => o.id === selectedOfferId)
      if (!offer || !product) throw new Error("No offer or product selected")

      const targetQty = offer.quantityRequired ?? 1
      const existing = findCartItem()

      if (existing) {
        // Already in cart -> update quantity to at least what the offer requires
        const nextQty = Math.max(existing.quantity, targetQty)
        return updateCartItem(existing.id, { quantity: nextQty })
      }
      // Not in cart -> add with offer-required quantity
      return addCartItem({ product_id: product.id, quantity: targetQty })
    },
    onSuccess: (response) => {
        queryClient.setQueryData(CART_KEYS.all, response)
      setSelectedOfferId(null)
      setCloseOffers()
    },
  })

  return (
    <Dialog open={offerDialogStatus} onOpenChange={setCloseOffers}>
      <DialogContent
        className="max-w-lg gap-0 overflow-hidden p-0"
        dir="rtl"
      >
        {/* ── Header with subtle gradient accent ────────────────── */}
        <div className="relative bg-linear-to-l from-primary/8 via-primary/4 to-transparent px-5 pb-4 pt-6 sm:px-6">
          {/* Decorative circle */}
          <div className="absolute left-0 top-0 h-24 w-24 translate-x-[-33%] -translate-y-1/3 rounded-full bg-primary/5" />

          <DialogHeader className="relative ">
            <div className="mb-1 mt-1 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-right text-base font-bold leading-tight">
                  {product?.name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-right text-xs">
                     {product?.supplierCompany?.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {offers.length > 0 && (
            <Badge variant="secondary" className="mt-3 text-[11px] font-medium">
              العروض المتاحة
            </Badge>
          )}
        </div>

        <Separator />

        {/* ── Offers list ───────────────────────────────────────── */}
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-5 py-4 sm:px-6">
          {offers.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                لا توجد عروض متاحة حالياً
              </p>
            </div>
          ) : (
            offers.map((offer) => {
              const details = getOfferDetails(offer)
              const isSelected = selectedOfferId === offer.id
              const isBuyGet = offer.offerType === "buy_x_get_y"

              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`group relative w-full overflow-hidden rounded-xl border-2 p-4 text-right hover:cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/3 shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]"
                      : "border-border/60 bg-card hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* ── Icon ────────────────────────────────── */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 
                      
                         bg-blue-100 text-primary"

                     
                    >
                      {isBuyGet ? (
                        <Gift className="h-5 w-5" />
                      ) : (
                        <Percent className="h-5 w-5" />
                      )}
                    </div>

                    {/* ── Content ─────────────────────────────── */}
                    <div className="min-w-0 flex-1">
                      {/* Title + type badge */}
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold leading-tight text-foreground">
                          {offer.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="h-[18px] border px-1.5 py-0 text-[10px] font-semibold 
                       
                             border-blue-200 bg-blue-100 text-primary"
                        >
                          {details.tagLabel}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="mb-2.5 text-[13px] leading-relaxed text-muted-foreground">
                        {details.label}
                      </p>

                      {/* Highlight chip + expiry date */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold 
                             bg-blue-100 text-primary"
                        >
                          {details.highlight}
                        </span>

                        {offer.endDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                            <CalendarDays className="h-3 w-3" />
                            حتى {formatDate(offer.endDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    
                    <div className="mr-1 shrink-0 self-center">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                          isSelected
                            ? "scale-110 border-primary bg-primary"
                            : "border-muted-foreground/25 group-hover:border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            className="h-3 w-3 text-primary-foreground"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <Separator />

        {/* ── Footer ────────────────────────────────────────────── */}
        <div className="bg-muted/30 px-5 py-4 sm:px-6">
          <DialogFooter className="flex-row-reverse gap-2.5 sm:flex-row-reverse">
            <Button
              disabled={selectedOfferId === null || applyOfferMutation.isPending}
              className="flex-1 gap-2 font-semibold sm:flex-initial hover:cursor-pointer"
              onClick={() => applyOfferMutation.mutate()}
            >
              {applyOfferMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              تطبيق العرض
            </Button>
            <Button
              variant="outline"
              onClick={() => setCloseOffers()}
              className=" hover:cursor-pointer hover:bg-muted hover:text-foreground"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
