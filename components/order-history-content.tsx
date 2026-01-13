"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

type HistoryStatus = "delivered" | "cancelled" | "shipping"

type HistoryOrder = {
  id: number
  pharmacyName: string
  category: string
  company: string
  status: HistoryStatus
  totalAmount: number
  date: string
  driver: string
}

const mockOrders: HistoryOrder[] = [
  {
    id: 901,
    pharmacyName: "صيدلية النهضة",
    category: "أدوية",
    company: "الشركة المصرية",
    status: "delivered",
    totalAmount: 1250.5,
    date: "2024-12-15",
    driver: "أحمد محمد",
  },
  {
    id: 902,
    pharmacyName: "صيدلية الشفاء",
    category: "مستلزمات",
    company: "المستلزمات الطبية",
    status: "cancelled",
    totalAmount: 890.0,
    date: "2024-12-10",
    driver: "-",
  },
  {
    id: 903,
    pharmacyName: "صيدلية الأمل",
    category: "أدوية",
    company: "المتحدة للأدوية",
    status: "shipping",
    totalAmount: 2150.75,
    date: "2024-12-18",
    driver: "خالد علي",
  },
  {
    id: 904,
    pharmacyName: "صيدلية الحياة",
    category: "أجهزة",
    company: "شركة الأجهزة الطبية",
    status: "delivered",
    totalAmount: 3200.0,
    date: "2024-12-12",
    driver: "سعيد حسن",
  },
]

export function OrderHistoryContent() {
  const [orders] = useState<HistoryOrder[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [showFilters, setShowFilters] = useState(false)

  const categories = Array.from(new Set(orders.map((o) => o.category)))
  const companies = Array.from(new Set(orders.map((o) => o.company)))

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toString().includes(searchQuery)
    const matchesCategory = !selectedCategory || order.category === selectedCategory
    const matchesCompany = !selectedCompany || order.company === selectedCompany
    const matchesStatus = !selectedStatus || order.status === selectedStatus

    let matchesDate = true
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.date)
      matchesDate = orderDate >= dateRange.from && orderDate <= dateRange.to
    }

    return matchesSearch && matchesCategory && matchesCompany && matchesStatus && matchesDate
  })

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedCompany("")
    setSelectedStatus("")
    setDateRange({ from: undefined, to: undefined })
  }

  const hasActiveFilters = selectedCategory || selectedCompany || selectedStatus || dateRange.from || dateRange.to

  const getStatusColor = (status: HistoryStatus) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "shipping":
        return "bg-blue-100 text-blue-700"
    }
  }

  const getStatusLabel = (status: HistoryStatus) => {
    switch (status) {
      case "delivered":
        return "تم التوصيل"
      case "cancelled":
        return "ملغي"
      case "shipping":
        return "قيد التوصيل"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">سجل الطلبات</h1>
        <p className="text-muted-foreground mt-2">عرض وتصفية سجل الطلبات السابقة</p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="بحث بالصيدلية أو رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <CalendarIcon className="h-4 w-4" />
              {dateRange.from && dateRange.to
                ? `${format(dateRange.from, "dd MMM", { locale: ar })} - ${format(dateRange.to, "dd MMM", { locale: ar })}`
                : "تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
              locale={ar}
            />
          </PopoverContent>
        </Popover>

        {/* Filters */}
        <div className="relative">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" />
            تصفية
            {hasActiveFilters && <span className="flex h-2 w-2 rounded-full bg-primary" />}
          </Button>

          {showFilters && (
            <Card className="absolute left-0 top-full mt-2 w-80 z-50 shadow-lg p-4 space-y-4">
              <div>
                <Label htmlFor="filter-category" className="text-sm">
                  التصنيف
                </Label>
                <select
                  id="filter-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">جميع التصنيفات</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="filter-company" className="text-sm">
                  الشركة
                </Label>
                <select
                  id="filter-company"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">جميع الشركات</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="filter-status" className="text-sm">
                  الحالة
                </Label>
                <select
                  id="filter-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">جميع الحالات</option>
                  <option value="delivered">تم التوصيل</option>
                  <option value="shipping">قيد التوصيل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
                  مسح التصفية
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right p-4 font-semibold text-sm">رقم الطلب</th>
                <th className="text-right p-4 font-semibold text-sm">الصيدلية</th>
                <th className="text-right p-4 font-semibold text-sm">التصنيف</th>
                <th className="text-right p-4 font-semibold text-sm">الشركة</th>
                <th className="text-right p-4 font-semibold text-sm">الحالة</th>
                <th className="text-right p-4 font-semibold text-sm">المندوب</th>
                <th className="text-right p-4 font-semibold text-sm">المبلغ</th>
                <th className="text-right p-4 font-semibold text-sm">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4 text-sm font-medium">#{order.id}</td>
                  <td className="p-4 text-sm">{order.pharmacyName}</td>
                  <td className="p-4 text-sm text-muted-foreground">{order.category}</td>
                  <td className="p-4 text-sm text-muted-foreground">{order.company}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </td>
                  <td className="p-4 text-sm">{order.driver}</td>
                  <td className="p-4 text-sm font-medium text-primary">{order.totalAmount.toFixed(2)}ل.س</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">لا توجد طلبات تطابق البحث أو التصفية</div>
          )}
        </div>
      </Card>
    </div>
  )
}
