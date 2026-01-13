"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

type ProductFormData = {
  name: string
  price: string
  quantity: string
  company: string
  category: string
}

type ProductAddFormProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: ProductFormData) => void
}

export function ProductAddForm({ isOpen, onClose, onAdd }: ProductAddFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    quantity: "",
    company: "",
    category: "",
  })

  const handleSubmit = () => {
    if (formData.name && formData.price && formData.quantity && formData.company && formData.category) {
      onAdd(formData)
      setFormData({ name: "", price: "", quantity: "", company: "", category: "" })
    }
  }

  if (!isOpen) return null

  return (
    <Card className="border-primary/50 shadow-lg animate-in slide-in-from-top-2 duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold">إضافة منتج جديد</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="name" className="text-sm">
              اسم المنتج
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: دواء باراسيتامول"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="price" className="text-sm">
              السعر (ر.س)
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm">
              الكمية
            </Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-sm">
              الشركة
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="مثال: الشركة المصرية"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">
              التصنيف
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="مثال: أدوية"
              className="mt-1"
            />
          </div>

          <div className="sm:flex sm:items-end">
            <Button onClick={handleSubmit} className="w-full">
              حفظ المنتج
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
