"use client"

import { OrdersView } from "./orders-view-toggle"

interface OrdersSkeletonProps {
  count?: number
  view?: OrdersView
}

export function OrdersSkeleton({ count = 9, view = "grid" }: OrdersSkeletonProps) {
  const containerClass =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      : "flex flex-col gap-3"

  return (
    <div className={containerClass}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-2 h-3.5 w-32 animate-pulse rounded bg-muted" />
          <div className="my-4 border-t border-dashed" />
          <div className="flex items-end justify-between">
            <div className="space-y-1.5">
              <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-14 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}