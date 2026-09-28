"use client";

import { LayoutGrid, List } from "lucide-react";

export type OrdersView = "grid" | "list";

interface OrdersViewToggleProps {
  view: OrdersView;
  onChange: (view: OrdersView) => void;
}

export function OrdersViewToggle({ view, onChange }: OrdersViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border bg-muted/40 p-0.5">
      <button
        type="button"
        aria-label="عرض شبكي"
        aria-pressed={view === "grid"}
        onClick={() => onChange("grid")}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          view === "grid"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutGrid size={16} />
      </button>
      <button
        type="button"
        aria-label="عرض قائمة"
        aria-pressed={view === "list"}
        onClick={() => onChange("list")}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          view === "list"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <List size={16} />
      </button>
    </div>
  );
}