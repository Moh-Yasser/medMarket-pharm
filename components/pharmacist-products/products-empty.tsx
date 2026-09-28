"use client";

import { Inbox, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductsEmptyProps = {
  /** Pass this when the empty result is caused by active search/filter criteria. */
  hasFilters:boolean
};

export function ProductsEmpty({  hasFilters }: ProductsEmptyProps) {
  const Icon = hasFilters ? SearchX : Inbox;

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 px-6 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon aria-hidden="true" className="size-6 text-muted-foreground" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-foreground">
          {hasFilters ? "لا توجد نتائج مطابقة" : "لا توجد منتجات بعد"}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {hasFilters
            ? "لم نعثر على أي منتجات تطابق الفلاتر الحالية. جرّب تعديلها أو إزالتها."
            : "لم تتم إضافة أي منتجات إلى هذا القسم حتى الآن."}
        </p>
      </div>
    </div>
  );
}