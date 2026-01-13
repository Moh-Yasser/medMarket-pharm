"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

type ProductFiltersProps = {
  isOpen: boolean
  onClose: () => void
  companies: string[]
  categories: string[]
  selectedCompany: string
  selectedCategory: string
  selectedDateRange: string
  onCompanyChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function ProductFilters({
  isOpen,
  onClose,
  companies,
  categories,
  selectedCompany,
  selectedCategory,
  selectedDateRange,
  onCompanyChange,
  onCategoryChange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
}: ProductFiltersProps) {
  if (!isOpen) return null

  return (
    <Card className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-80 z-50 shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold">تصفية المنتجات</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="filter-company" className="text-sm">
              الشركة
            </Label>
            <select
              id="filter-company"
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value)}
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
            <Label htmlFor="filter-category" className="text-sm">
              التصنيف
            </Label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="filter-date" className="text-sm">
              تاريخ الإضافة
            </Label>
            <select
              id="filter-date"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">جميع التواريخ</option>
              <option value="اليوم">اليوم</option>
              <option value="الأسبوع">الأسبوع</option>
              <option value="الشهر">الشهر</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="w-full bg-transparent text-sm">
            مسح التصفية
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
