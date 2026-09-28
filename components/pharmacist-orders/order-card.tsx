"use client";

import { Order } from "@/types/orders_cart";
import { ViewStatus } from "@/components/view-status";
import { Building2, Calendar, ChevronLeft } from "lucide-react";

function getQuantityLabel(total: number) {
  if (total === 0) return "لا توجد منتجات";
  if (total === 1) return "منتج واحد";
  if (total === 2) return "منتجان";
  if (total <= 10) return `${total} منتجات`;
  return `${total} منتج`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const totalQuantity = order.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const interactive = Boolean(onClick);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onClick!(order) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick!(order);
              }
            }
          : undefined
      }
      className={`group flex flex-col rounded-lg border bg-card p-5 transition-colors ${
        interactive
          ? "cursor-pointer hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          : ""
      }`}
    >
      {/* Identity: order number is the card's heading, status is a trailing tag */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-foreground tabular-nums">
          طلب #{order.orderNumber}
        </span>
        <ViewStatus status={order.status} />
      </div>

      {/* Supplier and date share one row — two secondary facts, one line */}
      <div className="mt-1.5 flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <Building2 size={14} className="shrink-0" />
          <span className="truncate">{order.supplierCompany.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-xs">
          <Calendar size={13} />
          {formatDate(order.createdAt)}
        </span>
      </div>

      {/* Receipt-style tear line before the summary — fits the order/invoice subject */}
      <div className="my-4 border-t border-dashed" aria-hidden="true" />

      <div className="flex justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">المبلغ الكلي</p>
          <p className="mt-0.5 text-lg font-semibold text-primary">
            {formatAmount(order.totalAmount)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ل.س
            </span>
          </p>
        </div>
        <div>
          <p className="mt-0.5 text-sm text-foreground">
            {getQuantityLabel(totalQuantity)}
          </p>
        </div>
      </div>

      {interactive && (
        <div className="mt-4 self-end flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
             عرض التفاصيل
          <ChevronLeft size={14} />
       
        </div>
      )}
    </div>
  );
}