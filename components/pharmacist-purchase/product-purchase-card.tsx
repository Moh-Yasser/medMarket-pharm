"use client";

import { Building2, Loader2, Package, RotateCw, StickyNote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Product } from "@/types/products";

import { CartActions } from "@/components/cart-actions";
import { Price } from "./product-purchase-card-utils";
import { AppliedOfferChip } from "./product-offer-chip";
import { CartItem } from "@/types/orders_cart";
import { TrashButton } from "../pharmacist-cart/trash-button";

function CardShell({
  title,
  supplier,
  meta,
  headerEnd,
  offer,
  notes,
  footer,
}: {
  title: React.ReactNode;
  supplier?: string;
  meta?: string;
  headerEnd?: React.ReactNode;
  offer?: React.ReactNode;
  notes?: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col gap-4 rounded-2xl p-4 sm:p-5 ">
      <CardContent className="flex flex-1 flex-col gap-4 p-0">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-semibold leading-snug wrap-break-word">{title}</p>
            {supplier && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{supplier}</span>
              </p>
            )}
            {meta && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                {meta}
              </p>
            )}
          </div>
          {headerEnd}
        </div>

        {offer}
        {notes}

        <div className="mt-auto flex flex-col gap-3">
          <Separator />
          {footer}
        </div>
      </CardContent>
    </Card>
  );
}

function NotesLine({ notes }: { notes: string }) {
  return (
    <p className="flex items-start gap-1.5 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
      <StickyNote className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span className="line-clamp-2">{notes}</span>
    </p>
  );
}

function metaLine(product?: Pick<Product, "sku" | "barcode">) {
  return [product?.sku, product?.barcode].filter(Boolean).join(" · ") || undefined;
}

/* -------------------------------------------------------------------------- */
/*  Variant 1 — cart (items in the current cart)                              */
/* -------------------------------------------------------------------------- */

function CartCard({ item }: { item: CartItem }) {
  const { product, unitPrice, quantity, totalPrice, appliedOffer, notes } = item;
  const lineSubtotal = unitPrice * quantity;

  return (
    <CardShell
      title={product?.name ?? "منتج غير معروف"}
      supplier={product?.supplierCompany?.name}
      meta={metaLine(product)}
      headerEnd={<TrashButton product={item} />}
      offer={
        appliedOffer ? (
          <AppliedOfferChip offer={appliedOffer} item={item} lineSubtotal={lineSubtotal} />
        ) : undefined
      }
      notes={notes ? <NotesLine notes={notes} /> : undefined}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Price value={totalPrice} className="text-lg font-bold text-primary" />
          <CartActions product={item} />
        </div>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Variant 2 — order (past order line items)                                 */
/* -------------------------------------------------------------------------- */

function OrderCard({
  item,
  onReorder,
  isReordering,
}: {
  item: CartItem;
  onReorder?: (item: CartItem) => void;
  isReordering?: boolean;
}) {
  const { product, unitPrice, quantity, totalPrice, appliedOffer, notes } = item;
  const lineSubtotal = unitPrice * quantity;

  return (
    <CardShell
      title={product?.name ?? "منتج غير معروف"}
      supplier={product?.supplierCompany?.name}
      meta={metaLine(product)}
      headerEnd={
        onReorder && (
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
        )
      }
      offer={
        appliedOffer ? (
          <AppliedOfferChip offer={appliedOffer} item={item} lineSubtotal={lineSubtotal} />
        ) : undefined
      }
      notes={notes ? <NotesLine notes={notes} /> : undefined}
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{quantity}</span>{" "}
            × <Price value={unitPrice} />
          </p>
          <Price value={totalPrice} className="text-lg font-bold text-primary" />
        </div>
      }
    />
  );
}

export type ProductPurchaseCardProps =
  | { variant: "cart"; item: CartItem }
  | { variant: "order"; item: CartItem; onReorder?: (item: CartItem) => void; isReordering?: boolean };

export function ProductPurchaseCard(props: ProductPurchaseCardProps) {
  switch (props.variant) {
    case "cart":
      return <CartCard item={props.item} />;
    case "order":
      return <OrderCard item={props.item} onReorder={props.onReorder} isReordering={props.isReordering} />;
  }
}