"use client"

import { useRef, useEffect } from "react"
import { Package, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemBySupplier } from "@/types/orders_cart"
import { PriceCode } from "../pharmacist-products/product-price"
import { cn } from "@/lib/utils"

interface SupplierTabsProps {
  activeGroup: number
  onSelect: (id: number) => void
  CartItems: ItemBySupplier[]
}

export function SupplierTabs({ activeGroup, onSelect, CartItems }: SupplierTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const groups = CartItems

  /* Auto-scroll the active tab into view */
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const activeEl = container.children[activeGroup] as HTMLElement | undefined
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeGroup])

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    const amount = container.clientWidth * 0.6
    container.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (groups.length === 0) return null

  /* Single supplier — no tabs needed, just a header */
  if (groups.length === 1) {
    const g = groups[0]
    return (
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{g.supplier.name}</p>
            <p className="text-xs text-muted-foreground">
              {g.itemCount} منتج &bull; {g.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <PriceCode />
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Scroll shadow + arrows for large lists */}
      {groups.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 translate-x-1/2 rounded-full border bg-background shadow-md hover:bg-muted sm:flex hidden"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 -translate-x-1/2 rounded-full border bg-background shadow-md hover:bg-muted sm:flex hidden"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groups.map((group, index) => {
          const isActive = activeGroup === index
          return (
            <button
              key={group.supplier.id}
              onClick={() => onSelect(index)}
              className={cn(
                "group relative flex min-w-[200px] shrink-0 flex-col gap-2 rounded-xl border-2 p-4 text-right transition-all duration-200",
                "hover:shadow-md hover:border-primary/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                isActive
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border/50 bg-card hover:bg-muted/50"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute inset-x-3 -top-[2px] h-[3px] rounded-full bg-primary" />
              )}

              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold transition-colors",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {group.supplier.name}
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {group.itemCount} منتج
                </span>
                <span
                  className={cn(
                    "tabular-nums font-semibold",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {group.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <PriceCode className="text-[10px]" />
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Dot indicators for mobile when many tabs */}
      {groups.length > 2 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 sm:hidden">
          {groups.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                activeGroup === i
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
