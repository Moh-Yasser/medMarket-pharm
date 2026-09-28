import { cn } from "@/lib/utils";
import { PriceCode } from "../pharmacist-products/product-price";

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("ar-SY-u-nu-latn", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const fmt = (n: number | null | undefined) =>
  n === null || n === undefined || Number.isNaN(n) ? "—" : numberFormat.format(n);

export function formatDate(value: string) {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? "—" : dateFormat.format(t);
}

/** Price + currency code, e.g. "1250 <PriceCode/>". */
export function Price({
  value,
  className,
}: {
  value: number | null | undefined;
  className?: string;
}) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span className={className}>—</span>;
  }
  return (
    <span dir="ltr" className={cn("inline-flex items-baseline gap-1 tabular-nums", className)}>
      {value.toFixed(0)} <PriceCode />
    </span>
  );
}