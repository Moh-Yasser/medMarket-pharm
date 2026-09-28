import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/orders_cart";

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: "قيد الانتظار",
    badge: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    dot: "bg-orange-500",
  },
   accepted: {
    label: "تمت الموافقة",
    badge: "bg-primary/10 text-primary border-primary/20",
    dot: "bg-primary",
  },
  prepared: {
    label: "تم التجهيز",
    badge: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    dot: "bg-violet-500",
  },
  shipped: {
    label: "قيد التوصيل",
    badge: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "تم التسليم",
    badge: "bg-accent/10 text-green-700 border-accent/20",
    dot: "bg-green-700",
  },
  cancelled: {
    label: "ملغي",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
};

export function ViewStatus({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}