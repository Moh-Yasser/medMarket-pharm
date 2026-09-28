"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrdersErrorProps {
  onRetry?: () => void
}

export function OrdersError({ onRetry }: OrdersErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <AlertCircle className="text-muted-foreground" size={28} />
      <div>
        <p className="font-medium text-foreground">تعذّر تحميل الطلبات</p>
        <p className="mt-1 text-sm text-muted-foreground">
          حدث خطأ أثناء الاتصال بالخادم، حاول مرة أخرى
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}