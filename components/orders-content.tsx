"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Package } from "lucide-react"

type OrderStatus = "new" | "processing"

type Order = {
  id: number
  pharmacyName: string
  area: string
  status: OrderStatus
  assignedDriver: string | null
  totalAmount: number
  itemsCount: number
  date: string
}

const mockDrivers = ["أحمد محمد - المنطقة الشرقية", "خالد علي - المنطقة الغربية", "سعيد حسن - المنطقة الشمالية"]

const initialOrders: Order[] = [
  {
    id: 1001,
    pharmacyName: "صيدلية النهضة",
    area: "المنطقة الشرقية",
    status: "new",
    assignedDriver: null,
    totalAmount: 1250.5,
    itemsCount: 8,
    date: "2024-12-21",
  },
  {
    id: 1002,
    pharmacyName: "صيدلية الشفاء",
    area: "المنطقة الغربية",
    status: "processing",
    assignedDriver: "خالد علي",
    totalAmount: 890.0,
    itemsCount: 5,
    date: "2024-12-21",
  },
  {
    id: 1003,
    pharmacyName: "صيدلية الأمل",
    area: "المنطقة الشرقية",
    status: "new",
    assignedDriver: null,
    totalAmount: 2150.75,
    itemsCount: 12,
    date: "2024-12-20",
  },
]

export function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const handleAssignDriver = (orderId: number, driverName: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedDriver: driverName,
              status: "processing" as OrderStatus,
            }
          : order,
      ),
    )
  }

  const getDriversByArea = (area: string) => {
    return mockDrivers.filter((driver) => driver.includes(area.replace("المنطقة ", "")))
  }

  const getStatusColor = (status: OrderStatus) => {
    return status === "new" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
  }

  const getStatusLabel = (status: OrderStatus) => {
    return status === "new" ? "طلب جديد" : "قيد المعالجة"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">الطلبات</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">إدارة الطلبات الجديدة وقيد المعالجة</p>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Order Header */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <h3 className="text-base sm:text-lg font-semibold">طلب #{order.id}</h3>
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                </div>

                {/* Order Details */}
                <div className="grid gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4 flex-shrink-0" />
                    <span>{order.pharmacyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{order.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {order.assignedDriver ? (
                        <span className="text-foreground font-medium">{order.assignedDriver}</span>
                      ) : (
                        <span className="text-destructive">بدون مندوب</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">{order.itemsCount} منتج</span>
                  <span className="font-semibold text-primary">{order.totalAmount.toFixed(2)}ل.س</span>
                  <span className="text-muted-foreground">{new Date(order.date).toLocaleDateString("ar-SA")}</span>
                </div>
              </div>

              {/* Assign Driver */}
              {!order.assignedDriver && (
                <div className="w-full sm:w-auto sm:mr-4">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignDriver(order.id, e.target.value)
                      }
                    }}
                    defaultValue=""
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" disabled>
                      تعيين مندوب
                    </option>
                    {getDriversByArea(order.area).map((driver, idx) => (
                      <option key={idx} value={driver.split(" - ")[0]}>
                        {driver}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card className="p-8 sm:p-12">
          <div className="text-center text-sm sm:text-base text-muted-foreground">لا توجد طلبات حالياً</div>
        </Card>
      )}
    </div>
  )
}
