"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type CreateOfferDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockProducts = [
  "باراسيتامول 500 ملغ",
  "أموكسيسيلين 250 ملغ",
  "إيبوبروفين 400 ملغ",
  "فيتامين د 1000 وحدة",
  "أسبرين 100 ملغ",
  "محلول معقم 500 مل",
  "شاش طبي معقم",
]

export function CreateOfferDialog({ open, onOpenChange }: CreateOfferDialogProps) {
  const [offerType, setOfferType] = useState<"percentage" | "fixed">("percentage")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء عرض جديد</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Offer Name */}
          <div>
            <Label htmlFor="offer-name">اسم العرض</Label>
            <Input id="offer-name" placeholder="مثال: خصم الشتاء" className="mt-1" />
          </div>

          {/* Offer Type */}
          <div>
            <Label>نوع العرض</Label>
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant={offerType === "percentage" ? "default" : "outline"}
                onClick={() => setOfferType("percentage")}
                className="flex-1"
              >
                خصم نسبة %
              </Button>
              <Button
                type="button"
                variant={offerType === "fixed" ? "default" : "outline"}
                onClick={() => setOfferType("fixed")}
                className="flex-1"
              >
                خصم مبلغ ثابت
              </Button>
            </div>
          </div>

          {/* Offer Value */}
          <div>
            <Label htmlFor="offer-value">{offerType === "percentage" ? "نسبة الخصم (%)" : "قيمة الخصم (ر.س)"}</Label>
            <Input
              id="offer-value"
              type="number"
              placeholder={offerType === "percentage" ? "20" : "50"}
              className="mt-1"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">تاريخ البدء</Label>
              <Input id="start-date" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="end-date">تاريخ الانتهاء</Label>
              <Input id="end-date" type="date" className="mt-1" />
            </div>
          </div>

          {/* Products Selection */}
          <div>
            <Label>المنتجات ({selectedProducts.length} محدد)</Label>
            <div className="border rounded-lg p-4 mt-2 max-h-64 overflow-y-auto space-y-2">
              {mockProducts.map((product) => (
                <label
                  key={product}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product)}
                    onChange={() => toggleProduct(product)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{product}</span>
                </label>
              ))}
            </div>

            {/* Selected Products Preview */}
            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProducts.map((product) => (
                  <Badge key={product} variant="secondary" className="gap-1">
                    {product}
                    <button
                      type="button"
                      onClick={() => toggleProduct(product)}
                      className="hover:bg-background/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button>إنشاء العرض</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
