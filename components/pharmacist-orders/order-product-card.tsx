"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Boxes,
  CalendarDays,
  Gift,
  Info,
  Loader2,
  Package,
  Percent,
  RotateCw,
  Sparkles,
  StickyNote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

import type { Product } from "@/types/products";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/*  Defined here to match exactly what was given. If these already live in    */
/*  your `@/types` folder, delete these two and import them instead.         */
/* -------------------------------------------------------------------------- */

export interface ProductOffer {
  id: number;
  name: string;
  description: string;
  offerType: string;
  discountValue: number;
  discountType: string;
  quantityRequired: number | null;
  quantityFree: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCurrentlyActive: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  appliedOffer?: ProductOffer;
  appliedOfferId?: number;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*  Offer styling — one entry per offer type, shared by the chip and dialog   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const fmt = (n: number | null | undefined) =>
  n === null || n === undefined || Number.isNaN(n) ? "—" : numberFormat.format(n);
const money = (n: number | null | undefined) => `${fmt(n)} ل.س`;

function formatDate(value: string) {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? "—" : dateFormat.format(t);
}

function offerTerms(offer: ProductOffer) {
  const q = offer.quantityRequired;
  const free = offer.quantityFree;
  const v = offer.discountValue;

  switch (offer.offerType) {
    case "buy_x_get_y":
      return `اشتري ${fmt(q)} واحصل على ${fmt(free)} مجانًا`;
    case "percentage_discount":
      return `اشتري ${fmt(q)} واحصل على خصم ${fmt(v)}%`;
    case "fixed_discount":
      return `اشتري ${fmt(q)} واحصل على خصم ${fmt(v)} ل.س`;
    case "bundle_fixed":
      return `اشتري الحزمة واحصل على خصم ${fmt(v)} ل.س`;
    case "bundle_percentage":
      return `اشتري الحزمة واحصل على خصم ${fmt(v)}%`;
    default:
      if (offer.discountType === "percentage") return `خصم ${fmt(v)}%`;
      if (offer.discountType === "fixed") return `خصم ${fmt(v)} ل.س`;
      return offer.description || "تفاصيل العرض غير متوفرة";
  }
}

/** Current status of the offer, shown as reference — it may have changed since the order was placed. */
function offerStatusLabel(offer: ProductOffer) {
  if (offer.isCurrentlyActive) return { text: "ما يزال ساريًا", tone: "positive" as const };
  const now = Date.now();
  const end = new Date(offer.endDate).getTime();
  if (!Number.isNaN(end) && end < now) return { text: "انتهى العرض", tone: "muted" as const };
  return { text: "غير مفعل حاليًا", tone: "muted" as const };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface OrderItemCardProps {
  item: CartItem;
  /** Show a "buy again" action. Omit to render a purely read-only card. */
  onReorder?: (item: CartItem) => void;
  isReordering?: boolean;
}

export default function OrderItemCard({
  item,
  onReorder,
  isReordering = false,
}: OrderItemCardProps) {
  const { product, quantity, unitPrice, totalPrice, appliedOffer, notes } = item;

  const lineSubtotal = unitPrice * quantity;
  const savings = Math.max(0, Math.round((lineSubtotal - totalPrice) * 100) / 100);
  const hasSavings = savings > 0;

  return (
    <Card className="gap-4 rounded-2xl p-4 sm:p-5">
      <CardContent className="flex flex-col gap-4 p-0">
        {/* ---------------------------- Header row ---------------------------- */}
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug break-words">
              {product?.name ?? "منتج غير معروف"}
            </p>
            {(product?.sku || product?.barcode) && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                {[product?.sku, product?.barcode].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {onReorder && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              disabled={isReordering}
              onClick={() => onReorder(item)}
            >
              {isReordering ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RotateCw className="size-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">إعادة الطلب</span>
            </Button>
          )}
        </div>

        {appliedOffer && <OfferChip offer={appliedOffer} lineSubtotal={lineSubtotal} item={item} />}

        {notes && (
          <p className="flex items-start gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{notes}</span>
          </p>
        )}

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{quantity}</span>
            {" × "}
            <span dir="ltr" className="tabular-nums">{money(unitPrice)}</span>
          </p>

          <div className="flex items-center gap-3">
            {hasSavings && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
                <Sparkles className="size-3.5" aria-hidden="true" />
                وفّرت <span dir="ltr">{money(savings)}</span>
              </span>
            )}
            <span className="text-lg font-bold tabular-nums text-primary" dir="ltr">
              {money(totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function OfferChip({
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
  const status = useMemo(() => offerStatusLabel(offer), [offer]);
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
            <span className={cn("block truncate text-sm font-semibold", style.text)}>
              {offer.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {style.label}
            </span>
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
          <DialogDescription className="text-start text-foreground/80">
            {offer.description}
          </DialogDescription>
        )}

        <div className="space-y-1.5 rounded-xl bg-muted/60 p-3.5">
          <p className="text-xs font-medium text-muted-foreground">شروط العرض</p>
          <p className="text-sm font-medium">{offerTerms(offer)}</p>
        </div>

        <div className="space-y-2 rounded-xl border p-3.5">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            كيف طُبّق العرض على هذا الطلب
          </p>
          <DetailRow label="الكمية المشتراة" value={`${item.quantity}`} />
          <DetailRow label="سعر الوحدة" value={money(item.unitPrice)} />
          <DetailRow label="الإجمالي قبل العرض" value={money(lineSubtotal)} muted />
          <DetailRow label="الإجمالي المدفوع" value={money(item.totalPrice)} strong />
          {savings > 0 && (
            <DetailRow label="التوفير" value={money(savings)} accentClass={style.text} />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatDate(offer.startDate)} — {formatDate(offer.endDate)}
          </span>
          <Badge
            variant="outline"
            className={cn(
              status.tone === "positive"
                ? "border-brand/30 bg-brand/10 text-brand"
                : "text-muted-foreground",
            )}
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

function DetailRow({
  label,
  value,
  muted,
  strong,
  accentClass,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
  accentClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        dir="ltr"
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