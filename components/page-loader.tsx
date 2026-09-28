import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label ?? "جارٍ التحميل"}
      className={cn(
        "flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-16",
        className,
      )}
    >
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}