"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OrderDetailsErrorStateProps {
  onRetry: () => void
  isRetrying?: boolean
  title?: string
  description?: string
}

export function OrderDetailsErrorState({
  onRetry,
  isRetrying = false,
  title = "تعذر تحميل بيانات الطلب",
  description = "حدث خطأ أثناء جلب تفاصيل الطلب. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
}: OrderDetailsErrorStateProps) {
  return (
    <div dir="rtl" className="space-y-5">
      <Card className="rounded-4xl border bg-card shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <Button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-2 h-10 rounded-xl px-5"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "جاري إعادة المحاولة..." : "إعادة المحاولة"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}