"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  Barcode,
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  FlaskConical,
  Gift,
  Hash,
  Package,
  PackageOpen,
  Percent,
  SearchX,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { fetchProductDetail } from "@/lib/products/products.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { getCart } from "@/lib/cart/cart.client";
import type { Product, ProductApiResponse } from "@/types/products";
import type { CartApiResponse } from "@/types/orders_cart";
import type { ProductOffer } from "@/types/Offer";
import { CartActions } from "../cart-actions";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type CartItem = NonNullable<
  CartApiResponse["data"]
>["itemsBySupplier"][number]["items"][number];

type OfferType = ProductOffer["offerType"];
type OfferGroup = "free" | "discount" | "bundle";
type OfferStatus = "running" | "upcoming";

/**
 * The product payload is expected to carry its offers.
 * If you fetch them from a separate endpoint, replace `product.offers` below.
 */
type ProductWithOffers = Product & { offers?: ProductOffer[] };

interface PreparedOffer {
  offer: ProductOffer;
  status: OfferStatus;
  start: number | null;
  end: number | null;
  daysLeft: number | null;
}

/* -------------------------------------------------------------------------- */
/*  Offer styling: one place that defines label, icon and colour per type     */
/* -------------------------------------------------------------------------- */

interface OfferStyle {
  label: string;
  group: OfferGroup;
  icon: LucideIcon;
  /** start-side accent border (right side in RTL) */
  border: string;
  text: string;
  tint: string;
}

const OFFER_STYLES: Record<OfferType, OfferStyle> = {
  buy_x_get_y: {
    label: "هدية مجانية",
    group: "free",
    icon: Gift,
    border: "border-s-brand",
    text: "text-brand",
    tint: "bg-brand/10",
  },
  percentage_discount: {
    label: "خصم بنسبة مئوية على المنتج",
    group: "discount",
    icon: Percent,
    border: "border-s-primary",
    text: "text-primary",
    tint: "bg-primary/10",
  },
  fixed_discount: {
    label: "خصم بمبلغ ثابت على المنتج",
    group: "discount",
    icon: Banknote,
    border: "border-s-primary",
    text: "text-primary",
    tint: "bg-primary/10",
  },
  bundle_fixed: {
    label: "حزمة",
    group: "bundle",
    icon: Boxes,
    border: "border-s-purple",
    text: "text-purple",
    tint: "bg-purple/10",
  },
  bundle_percentage: {
    label: "حزمة",
    group: "bundle",
    icon: Boxes,
    border: "border-s-purple",
    text: "text-purple",
    tint: "bg-purple/10",
  },
};

const FALLBACK_STYLE = OFFER_STYLES.percentage_discount;
const styleOf = (type: string) =>
  OFFER_STYLES[type as OfferType] ?? FALLBACK_STYLE;

interface GroupStyle {
  label: string;
  icon: LucideIcon;
  /** static chip that previews which kinds of offers exist */
  chip: string;
  /** filter chip when selected */
  active: string;
}

const GROUPS: Record<OfferGroup, GroupStyle> = {
  free: {
    label: "هدايا مجانية",
    icon: Gift,
    chip: "border-brand/30 bg-brand/10 text-brand",
    active: "border-brand bg-brand text-white",
  },
  discount: {
    label: "خصومات",
    icon: Percent,
    chip: "border-primary/30 bg-primary/10 text-primary",
    active: "border-primary bg-primary text-primary-foreground",
  },
  bundle: {
    label: "حزم",
    icon: Boxes,
    chip: "border-purple/30 bg-purple/10 text-purple",
    active: "border-purple bg-purple text-white",
  },
};

const GROUP_ORDER: OfferGroup[] = ["free", "discount", "bundle"];

/* -------------------------------------------------------------------------- */
/*  Formatting helpers (Latin digits, UTC dates: same output on server/client) */
/* -------------------------------------------------------------------------- */

const DAY = 86_400_000;
const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const fmt = (n: number | null) => (n === null ? "—" : numberFormat.format(n));
const money = (n: number | null) => (n === null ? "—" : `${fmt(n)} ل.س`);

function parseTime(
  value: string | number | Date | null | undefined,
  endOfDay = false,
): number | null {
  if (!value) return null;
  const t = new Date(value).getTime();
  if (Number.isNaN(t)) return null;
  const dateOnly = typeof value === "string" && value.length <= 10;
  return endOfDay && dateOnly ? t + DAY - 1 : t;
}

function endsInLabel(days: number) {
  if (days <= 0) return "ينتهي اليوم";
  if (days === 1) return "ينتهي غدًا";
  if (days === 2) return "ينتهي خلال يومين";
  return `ينتهي خلال ${days} أيام`;
}

function offersCountLabel(n: number) {
  if (n === 1) return "عرض واحد متاح";
  if (n === 2) return "عرضان متاحان";
  if (n <= 10) return `${n} عروض متاحة`;
  return `${n} عرضًا متاحًا`;
}

function formatRange(start: number | null, end: number | null) {
  if (start !== null && end !== null)
    return `${dateFormat.format(start)} — ${dateFormat.format(end)}`;
  if (end !== null) return `حتى ${dateFormat.format(end)}`;
  if (start !== null) return `من ${dateFormat.format(start)}`;
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Offer logic                                                               */
/* -------------------------------------------------------------------------- */

function prepareOffers(offers: ProductOffer[], now: number): PreparedOffer[] {
  const prepared: PreparedOffer[] = [];

  for (const offer of offers) {
    if (!offer.isActive) continue;

    const start = parseTime(offer.startDate);
    const end = parseTime(offer.endDate, true);
    if (end !== null && end < now) continue; // expired

    prepared.push({
      offer,
      start,
      end,
      status: start !== null && start > now ? "upcoming" : "running",
      daysLeft: end === null ? null : Math.floor((end - now) / DAY),
    });
  }

  // running first (ending soonest on top), then upcoming (starting soonest)
  return prepared.sort((a, b) => {
    if (a.status !== b.status) return a.status === "running" ? -1 : 1;
    const ax = (a.status === "running" ? a.end : a.start) ?? Infinity;
    const bx = (b.status === "running" ? b.end : b.start) ?? Infinity;
    return ax - bx;
  });
}

interface Deal {
  lead: string;
  big: string;
  unit: string;
  note?: string;
}

function describeDeal(o: ProductOffer): Deal {
  const q = toNumber(o.quantityRequired);
  const free = toNumber(o.quantityFree);
  const v = toNumber(o.discountValue);
  const buy = `اشتري ${fmt(q)} واحصل على`;

  switch (o.offerType) {
    case "buy_x_get_y":
      return {
        lead: buy,
        big: fmt(free),
        unit: "مجانًا",
        note:
          q && free
            ? `يعادل خصمًا بنسبة ${fmt(Math.round((free / (q + free)) * 100))}% تقريبًا`
            : undefined,
      };
    case "percentage_discount":
      return { lead: buy, big: `${fmt(v)}%`, unit: "خصم" };
    case "fixed_discount":
      return { lead: buy, big: fmt(v), unit: "ل.س خصم" };
    case "bundle_fixed":
      return { lead: "اشتري الحزمة واحصل على", big: fmt(v), unit: "ل.س خصم" };
    case "bundle_percentage":
      return { lead: "اشتري الحزمة واحصل على", big: `${fmt(v)}%`, unit: "خصم" };
    default:
      return { lead: "", big: "—", unit: "" };
  }
}

/** Approximate saving in SYP for the offer types where it can be derived. */
function estimateSavings(o: ProductOffer, unitPrice: number | null) {
  if (unitPrice === null) return null;
  const q = toNumber(o.quantityRequired);
  const free = toNumber(o.quantityFree);
  const v = toNumber(o.discountValue);

  if (o.offerType === "buy_x_get_y" && free !== null) return free * unitPrice;
  if (o.offerType === "percentage_discount" && q !== null && v !== null)
    return (q * unitPrice * v) / 100;
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Cart helper (kept exported: it may be imported elsewhere)                 */
/* -------------------------------------------------------------------------- */

export function buildCartMap(
  cartResponse: CartApiResponse | undefined,
): Map<number, CartItem> {
  const map = new Map<number, CartItem>();
  if (!cartResponse?.data?.itemsBySupplier) return map;
  for (const group of cartResponse.data.itemsBySupplier) {
    for (const item of group.items) {
      map.set(item.product.id, item);
    }
  }
  return map;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ProductDetailsContent({
  productId,
}: {
  productId: string;
}) {
  const {
    data: fetchedProduct,
    isLoading,
    isError,
  } = useQuery<ProductApiResponse>({
    queryKey: PRODUCTS_KEYS.details(productId),
    queryFn: () => fetchProductDetail(productId),
  });
  const { data: cartData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  });

  const [filter, setFilter] = useState<"all" | OfferGroup>("all");

  const product = fetchedProduct?.data as ProductWithOffers | undefined;

  const cartsItemsByProductId = useMemo(
    () => buildCartMap(cartData),
    [cartData],
  );
  const cartsItem = cartsItemsByProductId.get(Number(productId));

  const offers = useMemo(
    () => prepareOffers(product?.offers ?? [], Date.now()),
    [product?.offers],
  );

  const groupCounts = useMemo(() => {
    const counts: Partial<Record<OfferGroup, number>> = {};
    for (const { offer } of offers) {
      const g = styleOf(offer.offerType).group;
      counts[g] = (counts[g] ?? 0) + 1;
    }
    return counts;
  }, [offers]);

  const presentGroups = GROUP_ORDER.filter((g) => groupCounts[g]);
  const visibleOffers =
    filter === "all"
      ? offers
      : offers.filter(({ offer }) => styleOf(offer.offerType).group === filter);

  if (isLoading) return <PageSkeleton />;
  if (isError || !product) return <ProductNotFound />;

  const purchasePrice = toNumber(product.pharmacistPrice);
  const customerPrice = toNumber(product.customerPrice);
  const margin =
    purchasePrice && customerPrice && customerPrice > purchasePrice
      ? Math.round(((customerPrice - purchasePrice) / purchasePrice) * 100)
      : null;

  return (
    <main
      dir="rtl"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-12 lg:px-16"
    >
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        العودة إلى المنتجات
      </Link>

      {/*
        Mobile order:  info → pricing → offers → supplier
        Desktop:       [ info + offers ] | [ sticky pricing + supplier ]
        The aside wrapper uses `contents` on mobile so its children can be
        reordered inside the parent grid.
      */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        {/* ------------------------------ Product ----------------------------- */}
        <Card className="order-1 gap-0 py-0 lg:order-0 lg:col-start-1 lg:row-start-1">
          <div className="flex items-start gap-4 p-5 sm:p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-16">
              <Package className="size-7" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight wrap-break-word sm:text-2xl lg:text-3xl">
                {product.name}
              </h1>

              {presentGroups.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {presentGroups.map((g) => {
                    const { icon: Icon, label, chip } = GROUPS[g];
                    return (
                      <li key={g}>
                        <a
                          href="#offers"
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                            chip,
                          )}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <Separator />

          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <InfoItem
              label="الفئة"
              value={product.category?.name}
              icon={<ClipboardList aria-hidden="true" />}
            />
            <InfoItem
              label="الشركة المصنعة"
              value={product.manufacturer?.name}
              icon={<FlaskConical aria-hidden="true" />}
            />
            <InfoItem
              label="الباركود"
              value={product.barcode}
              icon={<Barcode aria-hidden="true" />}
            />
            <InfoItem
              label="رمز المنتج (SKU)"
              value={product.sku}
              icon={<Hash aria-hidden="true" />}
            />
          </CardContent>
        </Card>

        {/* ------------------------- Pricing + supplier ------------------------ */}
        <div className="contents lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-6 lg:self-start lg:sticky lg:top-6">
          <Card className="order-2 lg:order-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="size-5" aria-hidden="true" /> التسعير
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <PriceRow label="سعر العميل" value={money(customerPrice)} />
             
              <PriceRow
                label="سعر الصيدلي"
                value={money(purchasePrice)}
                highlight
              />

              {margin !== null && (
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="size-4" aria-hidden="true" />
                    هامش الربح
                  </span>
                  <span className="font-semibold" dir="ltr">
                    {margin}%
                  </span>
                </div>
              )}

              {offers.length > 0 && (
                <a
                  href="#offers"
                  className="flex items-center justify-between rounded-xl border border-brand/30 bg-brand/10 px-3 py-2.5 text-sm font-medium text-brand transition-colors hover:bg-brand/15"
                >
                  <span className="inline-flex items-center gap-2">
                    <Gift className="size-4" aria-hidden="true" />
                    {offersCountLabel(offers.length)}
                  </span>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              )}
              <Separator />
 <div className="flex justify-between">
  <p>اضف الى عربة التسوق</p>
   <CartActions product={cartsItem ?? product} />
 </div>
             
            </CardContent>
          </Card>

          <Card className="order-4 lg:order-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" aria-hidden="true" /> التوريد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {product.supplierCompany?.name ?? "—"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                المورد الأساسي للمنتج
              </p>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------- Offers ---------------------------- */}
        <Card
          id="offers"
          className="order-3 scroll-mt-6 lg:order-none lg:col-start-1 lg:row-start-2"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="size-5 text-brand" aria-hidden="true" />
              <h2>العروض</h2>
              {offers.length > 0 && (
                <Badge variant="secondary" className="tabular-nums">
                  {offers.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              وفّر أكثر عند شراء كميات أكبر من هذا المنتج.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {offers.length === 0 ? (
              <div className="flex flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-10 text-center">
                <PackageOpen
                  className="mb-1 size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="font-medium">لا توجد عروض على هذا المنتج حاليًا</p>
                <p className="text-sm text-muted-foreground">
                  ستظهر هنا أي عروض جديدة من المورد فور إضافتها.
                </p>
              </div>
            ) : (
              <>
                {presentGroups.length > 1 && (
                  <OfferFilters
                    total={offers.length}
                    counts={groupCounts}
                    groups={presentGroups}
                    value={filter}
                    onChange={setFilter}
                  />
                )}

                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {visibleOffers.map((item) => (
                    <li key={item.offer.id}>
                      <OfferCard item={item} unitPrice={purchasePrice} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Offer card                                                                */
/* -------------------------------------------------------------------------- */

function OfferCard({
  item,
  unitPrice,
}: {
  item: PreparedOffer;
  unitPrice: number | null;
}) {
  const { offer, status, start, end, daysLeft } = item;
  const style = styleOf(offer.offerType);
  const Icon = style.icon;
  const deal = describeDeal(offer);
  const savings = estimateSavings(offer, unitPrice);
  const range = formatRange(start, end);
  const endingSoon =
    status === "running" && daysLeft !== null && daysLeft <= 7;

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-s-4 bg-card p-4 sm:p-5",
        style.border,
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className={cn("flex min-w-0 items-center gap-2", style.text)}>
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                style.tint,
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold leading-snug">{style.label}</p>
          </div>

          {status === "upcoming" ? (
            <Badge
              variant="outline"
              className="shrink-0 gap-1 whitespace-nowrap text-muted-foreground"
            >
              <Clock className="size-3" aria-hidden="true" />
              قريبًا
            </Badge>
          ) : endingSoon ? (
            <Badge
              variant="outline"
              className="shrink-0 gap-1 whitespace-nowrap border-destructive/30 bg-destructive/10 text-destructive"
            >
              <Clock className="size-3" aria-hidden="true" />
              {endsInLabel(daysLeft as number)}
            </Badge>
          ) : null}
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground break-words">
          {offer.name}
        </h3>
      </div>

      {/* The deal itself: the one element that should catch the eye */}
      <div className={cn("rounded-xl px-4 py-3", style.tint)}>
        <p className="text-sm text-muted-foreground">{deal.lead}</p>
        <p className={cn("mt-1 flex items-baseline gap-2", style.text)}>
          <span
            dir="ltr"
            className="text-3xl font-extrabold tabular-nums leading-none"
          >
            {deal.big}
          </span>
          <span className="text-sm font-semibold">{deal.unit}</span>
        </p>
        {deal.note && (
          <p className="mt-2 text-xs text-muted-foreground">{deal.note}</p>
        )}
        {savings !== null && savings > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Sparkles className={cn("size-3.5", style.text)} aria-hidden="true" />
            توفير تقريبي {money(Math.round(savings))}
          </p>
        )}
      </div>

      {offer.description && (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {offer.description}
        </p>
      )}

      {range && (
        <p className="mt-auto flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          {range}
        </p>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Filters                                                                   */
/* -------------------------------------------------------------------------- */

function OfferFilters({
  total,
  counts,
  groups,
  value,
  onChange,
}: {
  total: number;
  counts: Partial<Record<OfferGroup, number>>;
  groups: OfferGroup[];
  value: "all" | OfferGroup;
  onChange: (v: "all" | OfferGroup) => void;
}) {
  const base =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const idle = "bg-background text-muted-foreground hover:text-foreground";

  return (
    <div
      role="group"
      aria-label="تصفية العروض حسب النوع"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      <button
        type="button"
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
        className={cn(
          base,
          value === "all" ? "border-foreground bg-foreground text-background" : idle,
        )}
      >
        الكل
        <span className="tabular-nums opacity-70">{total}</span>
      </button>

      {groups.map((g) => {
        const { icon: Icon, label, active } = GROUPS[g];
        const selected = value === g;
        return (
          <button
            key={g}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(g)}
            className={cn(base, selected ? active : idle)}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            <span className="tabular-nums opacity-70">{counts[g]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:size-4">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-medium break-words">
          <bdi>{value || "—"}</bdi>
        </p>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          highlight ? "text-xl font-bold text-primary" : "font-semibold",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading and empty states                                                  */
/* -------------------------------------------------------------------------- */

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

function PageSkeleton() {
  return (
    <main
      dir="rtl"
      aria-busy="true"
      aria-label="جارٍ تحميل المنتج"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-12 lg:px-16"
    >
      <Bone className="h-5 w-36" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        <Bone className="h-64" />
        <Bone className="h-72 lg:col-start-2 lg:row-span-2 lg:row-start-1" />
        <Bone className="h-96 lg:col-start-1 lg:row-start-2" />
      </div>
    </main>
  );
}

function ProductNotFound() {
  return (
    <main
      dir="rtl"
      className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-3 px-4 text-center"
    >
      <SearchX className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-xl font-bold">تعذّر العثور على المنتج</h1>
      <p className="text-sm text-muted-foreground">
        ربما حُذف المنتج أو حدثت مشكلة أثناء التحميل. حاول مرة أخرى أو ارجع إلى
        قائمة المنتجات.
      </p>
      <Button asChild className="mt-2">
        <Link href="/products">العودة إلى المنتجات</Link>
      </Button>
    </main>
  );
}