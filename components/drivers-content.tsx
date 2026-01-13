"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Power, PowerOff, Eye } from "lucide-react"
import { CreateDriverDialog } from "@/components/create-driver-dialog"
import { DriverDetailsDrawer } from "@/components/driver-details-drawer"

type Driver = {
  id: number
  name: string
  phone: string
  areas: string[]
  isActive: boolean
  deliveredCount: number
  rating: number
}

const initialDrivers: Driver[] = [
  {
    id: 1,
    name: "أحمد محمد",
    phone: "0551234567",
    areas: ["المنطقة الشرقية", "المنطقة الشمالية"],
    isActive: true,
    deliveredCount: 245,
    rating: 4.8,
  },
  {
    id: 2,
    name: "خالد علي",
    phone: "0559876543",
    areas: ["المنطقة الغربية"],
    isActive: true,
    deliveredCount: 189,
    rating: 4.6,
  },
  {
    id: 3,
    name: "سعيد حسن",
    phone: "0551112233",
    areas: ["المنطقة الشمالية"],
    isActive: false,
    deliveredCount: 156,
    rating: 4.5,
  },
]

export function DriversContent() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const handleToggleStatus = (id: number) => {
    setDrivers(drivers.map((driver) => (driver.id === id ? { ...driver, isActive: !driver.isActive } : driver)))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">مندوبي التوصيل</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            إدارة حسابات مندوبي التوصيل ومتابعة أدائهم
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          إضافة مندوب
        </Button>
      </div>

      {/* Drivers Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <Card key={driver.id} className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Driver Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-base sm:text-lg flex-shrink-0">
                    {driver.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold truncate">{driver.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{driver.phone}</p>
                  </div>
                </div>
                <Badge
                  className={`${driver.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"} whitespace-nowrap`}
                >
                  {driver.isActive ? "نشط" : "معطل"}
                </Badge>
              </div>

              {/* Areas */}
              <div>
                <p className="text-xs sm:text-sm font-medium mb-2">المناطق المخصصة:</p>
                <div className="flex flex-wrap gap-2">
                  {driver.areas.map((area, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 sm:pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">الطلبات</p>
                  <p className="text-base sm:text-lg font-semibold">{driver.deliveredCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">التقييم</p>
                  <p className="text-base sm:text-lg font-semibold">{driver.rating} ⭐</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent text-xs sm:text-sm"
                  onClick={() => setSelectedDriver(driver)}
                >
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                  التفاصيل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 text-xs sm:text-sm ${
                    driver.isActive
                      ? "text-amber-600 hover:text-amber-600 hover:bg-amber-50"
                      : "text-green-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => handleToggleStatus(driver.id)}
                >
                  {driver.isActive ? (
                    <>
                      <PowerOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                      تعطيل
                    </>
                  ) : (
                    <>
                      <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2" />
                      تفعيل
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <Card className="p-8 sm:p-12">
          <div className="text-center text-sm sm:text-base text-muted-foreground">لا يوجد مندوبين حالياً</div>
        </Card>
      )}

      <CreateDriverDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <DriverDetailsDrawer driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </div>
  )
}
