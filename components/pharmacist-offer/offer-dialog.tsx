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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Resolve pivot overrides – pivot values take priority when present */
function resolveOffer(offer: ProductOffer) {
  return {
    qtyRequired: offer.pivot?.quantityRequired ?? offer.quantityRequired,
    qtyFree: offer.pivot?.quantityFree ?? offer.quantityFree,
    discount: offer.pivot?.discountOverride ?? offer.discountValue,
    discountType: offer.pivot?.discountTypeOverride ?? offer.discountType,
  }
}

/** Determine whether this is a "Buy X Get Y free" offer */
function isBuyXGetY(offer: ProductOffer): boolean {
  const { qtyFree } = resolveOffer(offer)
  return qtyFree !== null && qtyFree > 0
}

/** Build display-ready details for each offer */
function getOfferDetails(offer: ProductOffer) {
  const { qtyRequired, qtyFree, discount } = resolveOffer(offer)

  if (isBuyXGetY(offer)) {
    return {
      type: "buy_get" as const,
      label: `اشترِ ${qtyRequired} واحصل على ${qtyFree} مجاناً`,
      tagLabel: "هدية مجانية",
      highlight: `+${qtyFree} مجاناً`,
    }
  }

  return {
    type: "percentage" as const,
    label: `اشترِ ${qtyRequired} واحصل على خصم ${discount}%`,
    tagLabel: `خصم ${discount}%`,
    highlight: `${discount}% خصم`,
  }
}

/** Arabic-friendly date formatting */
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function OfferDialog() {
  const offerDialogStatus = useDialogStore((state) => state.offerDialogStatus)
  const product = useDialogStore((state) => state.product)
  const setCloseOffers = useDialogStore((state) => state.setCloseOffers)

  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null)

  const offers: ProductOffer[] = product?.offers ?? []

  return (
    <Dialog open={offerDialogStatus} onOpenChange={setCloseOffers}>
      <DialogContent
        className="max-w-lg gap-0 overflow-hidden p-0"
        dir="rtl"
      >
        {/* ── Header with subtle gradient accent ────────────────── */}
        <div className="relative bg-linear-to-l from-primary/8 via-primary/4 to-transparent px-5 pb-4 pt-6 sm:px-6">
          {/* Decorative circle */}
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5" />

          <DialogHeader className="relative">
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-right text-base font-bold leading-tight">
                  {product?.name}
                </DialogTitle>
                <DialogDescription className="mt-0.5 text-right text-xs">
                  العروض المتاحة من {product?.supplierCompany?.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {offers.length > 0 && (
            <Badge variant="secondary" className="mt-3 text-[11px] font-medium">
              {offers.length} {offers.length === 1 ? "عرض متاح" : "عروض متاحة"}
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
              const isBuyGet = details.type === "buy_get"

              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`group relative w-full overflow-hidden rounded-xl border-2 p-4 text-right transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/3 shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]"
                      : "border-border/60 bg-card hover:border-primary/30 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* ── Icon ────────────────────────────────── */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                        isBuyGet
                          ? isSelected
                            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-500"
                          : isSelected
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                            : "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-500"
                      }`}
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
                          className={`h-[18px] border px-1.5 py-0 text-[10px] font-semibold ${
                            isBuyGet
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                          }`}
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
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            isBuyGet
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                          }`}
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

                    {/* ── Radio indicator ─────────────────────── */}
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
              disabled={selectedOfferId === null}
              className="flex-1 gap-2 font-semibold sm:flex-initial"
              onClick={() => setCloseOffers()}
            >
              <ShoppingCart className="h-4 w-4" />
              تطبيق العرض
            </Button>
            <Button
              variant="outline"
              onClick={() => setCloseOffers()}
              className="bg-transparent"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
