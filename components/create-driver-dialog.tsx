"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

type CreateDriverDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableAreas = ["المنطقة الشرقية", "المنطقة الغربية", "المنطقة الشمالية", "المنطقة الجنوبية"]

export function CreateDriverDialog({ open, onOpenChange }: CreateDriverDialogProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مندوب جديد</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="driver-name">الاسم الكامل</Label>
            <Input id="driver-name" placeholder="مثال: أحمد محمد" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="driver-phone">رقم الجوال</Label>
            <Input id="driver-phone" type="tel" placeholder="05XXXXXXXX" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="driver-email">البريد الإلكتروني</Label>
            <Input id="driver-email" type="email" placeholder="driver@example.com" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="driver-password">كلمة المرور</Label>
            <Input id="driver-password" type="password" placeholder="********" className="mt-1" />
          </div>

          <div>
            <Label>المناطق المخصصة ({selectedAreas.length})</Label>
            <div className="border rounded-lg p-4 mt-2 space-y-2">
              {availableAreas.map((area) => (
                <label
                  key={area}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(area)}
                    onChange={() => toggleArea(area)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>

            {selectedAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="gap-1">
                    {area}
                    <button
                      type="button"
                      onClick={() => toggleArea(area)}
                      className="hover:bg-background/50 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button>إضافة المندوب</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
