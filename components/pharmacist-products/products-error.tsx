import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ProductsErrorProps = {
  onRetry: () => void;
  title?: string;
  message?: string;
  compact?: boolean;
  className?: string;
};

export function ProductsError({
  onRetry,
  title = "تعذّر تحميل المنتجات",
  message = "حدث خطأ أثناء جلب البيانات. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.",
  compact = false,
  className,
}: ProductsErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-6 text-center",
        compact ? "py-8" : "py-16",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>

      <Button type="button" variant="destructive" onClick={onRetry} className="cursor-pointer ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ">
        <RefreshCw aria-hidden="true" />
        إعادة المحاولة
      </Button>
    </div>
  );
}