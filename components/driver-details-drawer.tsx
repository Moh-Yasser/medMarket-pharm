"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Package, CheckCircle, XCircle } from "lucide-react"

type Driver = {
  id: number
  name: string
  phone: string
  areas: string[]
  isActive: boolean
  deliveredCount: number
  rating: number
}

type DriverDetailsDrawerProps = {
  driver: Driver | null
  onClose: () => void
}

const mockDeliveryHistory = [
  { id: 1001, pharmacy: "صيدلية النهضة", date: "2024-12-20", status: "delivered", amount: 1250.5 },
  { id: 1002, pharmacy: "صيدلية الشفاء", date: "2024-12-19", status: "delivered", amount: 890.0 },
  { id: 1003, pharmacy: "صيدلية الأمل", date: "2024-12-18", status: "cancelled", amount: 2150.75 },
  { id: 1004, pharmacy: "صيدلية الحياة", date: "2024-12-17", status: "delivered", amount: 3200.0 },
]

export function DriverDetailsDrawer({ driver, onClose }: DriverDetailsDrawerProps) {
  if (!driver) return null

  return (
    <Sheet open={!!driver} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>تفاصيل المندوب</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Driver Info */}
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-2xl">
                {driver.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{driver.name}</h3>
                <p className="text-sm text-muted-foreground">{driver.phone}</p>
                <Badge className={driver.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700 mt-2"}>
                  {driver.isActive ? "نشط" : "معطل"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">المناطق المخصصة:</p>
                <div className="flex flex-wrap gap-2">
                  {driver.areas.map((area, idx) => (
                    <Badge key={idx} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{driver.deliveredCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">التقييم</p>
                  <p className="text-2xl font-bold">{driver.rating} ⭐</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Delivery History */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              سجل التوصيل
            </h3>
            <div className="space-y-3">
              {mockDeliveryHistory.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">طلب #{order.id}</span>
                        {order.status === "delivered" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.pharmacy}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.date).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-primary">{order.amount.toFixed(2)}ل.س</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 text-xs ${
                          order.status === "delivered"
                            ? "border-green-600 text-green-600"
                            : "border-red-600 text-red-600"
                        }`}
                      >
                        {order.status === "delivered" ? "تم التوصيل" : "ملغي"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
