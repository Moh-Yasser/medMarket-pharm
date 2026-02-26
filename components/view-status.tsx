import { OrderStatus } from "@/types/orders_cart"
import { Badge } from "@/components/ui/badge"

export function ViewStatus({ status }: { status: OrderStatus }) {
    const statusStyles: Record<string, string> = {
        pending: "bg-orange-50 text-orange-400 ring-orange-700/10",
        accepted: "bg-primary/10 text-primary border-primary/20",
        shipped: "bg-secondary/10 text-secondary border-secondary/20",
        delivered: "bg-success/10 text-success border-success/20",
        cancelled: "bg-destructive/10 text-destructive border-destructive/20",
      }
      
      const statusLabels: Record<string, string> = {
        pending: "قيد الانتظار",
        accepted: "تمت الموافقة",
        shipped: "تم الشحن",
        delivered: "تم التسليم",
        cancelled: "ملغي",
      }
      return (
        <Badge variant="outline" className={statusStyles[status]}>
          {statusLabels[status]}
        </Badge>
      )
}