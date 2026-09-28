"use client";

import { useState } from "react";
import { Banknote, Boxes, CalendarDays, Gift, Info, Percent, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Price, fmt, formatDate } from "./product-purchase-card-utils";
import { ProductOffer } from "@/types/Offer";
import { PriceCode } from "../pharmacist-products/product-price";
import { CartItem } from "@/types/orders_cart";



interface OfferStyle {
  label: string;
  icon: LucideIcon;
  border: string;
  text: string;
  tint: string;
}

const OFFER_STYLES: Record<string, OfferStyle> = {
  buy_x_get_y: {
    label: "هدية مجانية",
    icon: Gift,
    border: "border-brand/30",
    text: "text-brand",
    tint: "bg-brand/10",
  },
  percentage_discount: {
    label: "خصم بنسبة مئوية",
    icon: Percent,
    border: "border-primary/30",
    text: "text-primary",
    tint: "bg-primary/10",
  },
  fixed_discount: {
    label: "خصم بمبلغ ثابت",
    icon: Banknote,
    border: "border-primary/30",
    text: "text-primary",
    tint: "bg-primary/10",
  },
  bundle_fixed: {
    label: "عرض حزمة",
    icon: Boxes,
    border: "border-purple/30",
    text: "text-purple",
    tint: "bg-purple/10",
  },
  bundle_percentage: {
    label: "عرض حزمة",
    icon: Boxes,
    border: "border-purple/30",
    text: "text-purple",
    tint: "bg-purple/10",
  },
};

const FALLBACK_STYLE: OfferStyle = {
  label: "عرض خاص",
  icon: Sparkles,
  border: "border-primary/30",
  text: "text-primary",
  tint: "bg-primary/10",
};

const styleOf = (offerType: string) => OFFER_STYLES[offerType] ?? FALLBACK_STYLE;

function OfferTerms({ offer }: { offer: ProductOffer }) {
  const q = offer.quantityRequired;
  const free = offer.quantityFree;
  const v = offer.discountValue;

  switch (offer.offerType) {
    case "buy_x_get_y":
      return (
        <>
          اشتري {fmt(q)} واحصل على {fmt(free)} مجانًا
        </>
      );
    case "percentage_discount":
      return (
        <>
          اشتري {fmt(q)} واحصل على خصم {fmt(v)}%
        </>
      );
    case "fixed_discount":
      return (
        <>
          اشتري {fmt(q)} واحصل على خصم {fmt(v)} <PriceCode />
        </>
      );
    case "bundle_fixed":
      return (
        <>
          اشتري الحزمة واحصل على خصم {fmt(v)} <PriceCode />
        </>
      );
    case "bundle_percentage":
      return (
        <>
          اشتري الحزمة واحصل على خصم {fmt(v)}%
        </>
      );
    default:
      if (offer.discountType === "percentage") return <>خصم {fmt(v)}%</>;
      if (offer.discountType === "fixed")
        return (
          <>
            خصم {fmt(v)} <PriceCode />
          </>
        );
      return <>{offer.description || "تفاصيل العرض غير متوفرة"}</>;
  }
}

function offerStatusLabel(offer: ProductOffer) {
  if (offer.isCurrentlyActive) return { text: "ساري الآن", tone: "positive" as const };
  const now = Date.now();
  const start = new Date(offer.startDate).getTime();
  const end = new Date(offer.endDate).getTime();
  if (!Number.isNaN(start) && start > now) return { text: "لم يبدأ بعد", tone: "muted" as const };
  if (!Number.isNaN(end) && end < now) return { text: "انتهى العرض", tone: "muted" as const };
  return { text: "غير مفعل", tone: "muted" as const };
}

function DetailRow({
  label,
  value,
  muted,
  strong,
  accentClass,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
  strong?: boolean;
  accentClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          muted && "text-muted-foreground",
          strong && "font-semibold",
          accentClass && cn("font-semibold", accentClass),
        )}
      >
        {value}
      </span>
    </div>
  );
}



export function AppliedOfferChip({
  offer,
  lineSubtotal,
  item,
}: {
  offer: ProductOffer;
  lineSubtotal: number;
  item: CartItem;
}) {
  const [open, setOpen] = useState(false);
  const style = styleOf(offer.offerType);
  const Icon = style.icon;
  const status = offerStatusLabel(offer);
  const savings = Math.max(0, Math.round((lineSubtotal - item.totalPrice) * 100) / 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-start transition-colors",
            "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            style.border,
            style.tint,
          )}
        >
          <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg bg-background", style.text)}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block truncate text-sm font-semibold", style.text)}>{offer.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{style.label}</span>
          </span>
          <Info className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", style.tint, style.text)}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 text-start">
              <DialogTitle className="break-words">{offer.name}</DialogTitle>
              <p className={cn("text-sm font-medium", style.text)}>{style.label}</p>
            </div>
          </div>
        </DialogHeader>

        {offer.description && (
          <DialogDescription className="text-start text-foreground/80">{offer.description}</DialogDescription>
        )}

        <div className="space-y-1.5 rounded-xl bg-muted/60 p-3.5">
          <p className="text-xs font-medium text-muted-foreground">شروط العرض</p>
          <p className="text-sm font-medium">
            <OfferTerms offer={offer} />
          </p>
        </div>

        <div className="space-y-2 rounded-xl border p-3.5">
          <p className="mb-1 text-xs font-medium text-muted-foreground">كيف طُبّق العرض على هذا الصنف</p>
          <DetailRow label="الكمية" value={`${item.quantity}`} />
          <DetailRow label="سعر الوحدة" value={<Price value={item.unitPrice} />} />
          <DetailRow label="الإجمالي قبل العرض" value={<Price value={lineSubtotal} />} muted />
          <DetailRow label="الإجمالي بعد العرض" value={<Price value={item.totalPrice} />} strong />
          {savings > 0 && (
            <DetailRow label="التوفير" value={<Price value={savings} />} accentClass={style.text} />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
          </span>
          <Badge
            variant="outline"
            className={cn(status.tone === "positive" ? "border-brand/30 bg-brand/10 text-brand" : "text-muted-foreground")}
          >
            {status.text}
          </Badge>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              إغلاق
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



export function AvailableOffersChip({ offers }: { offers: ProductOffer[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-start text-brand transition-colors hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background">
            <Gift className="size-4" aria-hidden="true" />
          </span>
          <span className="flex-1 text-sm font-semibold">
            {offers.length === 1 ? "يوجد عرض على هذا المنتج" : `يوجد ${fmt(offers.length)} عروض على هذا المنتج`}
          </span>
          <Info className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>عروض هذا المنتج</DialogTitle>
          <DialogDescription>اطّلع على العروض المتاحة قبل الإضافة إلى السلة.</DialogDescription>
        </DialogHeader>

        <ul className="space-y-3">
          {offers.map((offer) => {
            const style = styleOf(offer.offerType);
            const Icon = style.icon;
            return (
              <li key={offer.id} className={cn("space-y-1.5 rounded-xl border p-3.5", style.border, style.tint)}>
                <div className={cn("flex items-center gap-2", style.text)}>
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">{offer.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <OfferTerms offer={offer} />
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
                </p>
              </li>
            );
          })}
        </ul>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              إغلاق
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}