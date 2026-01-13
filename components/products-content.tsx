"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductAddForm } from "@/components/product-add-form"
import { ProductFilters } from "@/components/product-filters"

type Product = {
  id: number
  name: string
  price: number
  quantity: number
  company: string
  category: string
  date: string
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "دواء باراسيتامول 500 مجم",
    price: 12.5,
    quantity: 150,
    company: "الشركة المصرية",
    category: "أدوية",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "جهاز قياس ضغط الدم الرقمي",
    price: 245.0,
    quantity: 45,
    company: "شركة الأجهزة الطبية",
    category: "أجهزة",
    date: "2024-01-20",
  },
  {
    id: 3,
    name: "قفازات طبية معقمة - عبوة 100 قطعة",
    price: 35.0,
    quantity: 0,
    company: "المستلزمات الطبية",
    category: "مستلزمات",
    date: "2024-02-01",
  },
  {
    id: 4,
    name: "شاش طبي معقم 10×10 سم",
    price: 8.5,
    quantity: 320,
    company: "المستلزمات الطبية",
    category: "مستلزمات",
    date: "2024-02-10",
  },
  {
    id: 5,
    name: "محلول معقم للجروح 500 مل",
    price: 18.0,
    quantity: 0,
    company: "الشركة المصرية",
    category: "أدوية",
    date: "2024-02-15",
  },
]

export function ProductsContent() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")

  const companies = Array.from(new Set(products.map((p) => p.company)))
  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleAddProduct = (formData: {
    name: string
    price: string
    quantity: string
    company: string
    category: string
  }) => {
    const product: Product = {
      id: Math.max(...products.map((p) => p.id)) + 1,
      name: formData.name,
      price: Number.parseFloat(formData.price),
      quantity: Number.parseInt(formData.quantity),
      company: formData.company,
      category: formData.category,
      date: new Date().toISOString().split("T")[0],
    }
    setProducts([product, ...products])
    setShowAddForm(false)
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCompany = !selectedCompany || product.company === selectedCompany
    const matchesCategory = !selectedCategory || product.category === selectedCategory

    let matchesDate = true
    if (selectedDateRange) {
      const productDate = new Date(product.date)
      const today = new Date()
      if (selectedDateRange === "اليوم") {
        matchesDate = productDate.toDateString() === today.toDateString()
      } else if (selectedDateRange === "الأسبوع") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = productDate >= weekAgo
      } else if (selectedDateRange === "الشهر") {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = productDate >= monthAgo
      }
    }

    return matchesSearch && matchesCompany && matchesCategory && matchesDate
  })

  const clearFilters = () => {
    setSelectedCompany("")
    setSelectedCategory("")
    setSelectedDateRange("")
  }

  const hasActiveFilters = selectedCompany || selectedCategory || selectedDateRange

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">إدارة المنتجات</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">إضافة وتعديل وحذف المنتجات الطبية</p>
        </div>
        {/* Filter Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Filter Button */}
          <div className="relative">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4" />
              تصفية
              {hasActiveFilters && <span className="flex h-2 w-2 rounded-full bg-primary" />}
            </Button>

            <ProductFilters
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              companies={companies}
              categories={categories}
              selectedCompany={selectedCompany}
              selectedCategory={selectedCategory}
              selectedDateRange={selectedDateRange}
              onCompanyChange={setSelectedCompany}
              onCategoryChange={setSelectedCategory}
              onDateRangeChange={setSelectedDateRange}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Add Product Button */}
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            إضافة منتج
          </Button>
        </div>
      </div>

      {/* Add Product Form */}
      <ProductAddForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} onAdd={handleAddProduct} />

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">اسم المنتج</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">السعر</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">الكمية</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">الشركة</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">تاريخ الإضافة</th>
                <th className="text-right p-3 sm:p-4 font-semibold text-xs sm:text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="font-medium max-w-[200px] truncate text-xs sm:text-sm" title={product.name}>
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{product.category}</div>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">{product.price.toFixed(2)}ل.س</td>
                  <td className="p-3 sm:p-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-xs font-medium",
                        product.quantity === 0
                          ? "bg-red-100 text-red-700"
                          : product.quantity < 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700",
                      )}
                    >
                      {product.quantity}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm">{product.company}</td>
                  <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                    {new Date(product.date).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-muted-foreground">
              لا توجد منتجات تطابق البحث أو التصفية
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
