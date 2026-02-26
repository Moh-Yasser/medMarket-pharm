import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { orders } from "@/lib/data"

const statusStyles: Record<string, string> = {
  Pending: "bg-warning/10 text-warning-foreground border-warning/20",
  Approved: "bg-primary/10 text-primary border-primary/20",
  Shipped: "bg-secondary/10 text-secondary border-secondary/20",
  Delivered: "bg-success/10 text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels: Record<string, string> = {
  Pending: "قيد الانتظار",
  Approved: "تمت الموافقة",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Cancelled: "ملغي",
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = orders.find((o) => o.id === id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6 px-4 lg:px-8 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">الطلب {order.id}</h1>
          <p className="text-sm text-muted-foreground mt-1">عرض تفاصيل الطلب والفاتورة</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">معلومات الطلب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">رقم الطلب</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">تاريخ الطلب</span>
              <span>
                {new Date(order.date).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">المستودع</span>
              <span>{order.warehouseName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الحالة</span>
              <Badge variant="outline" className={statusStyles[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">ملخص الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>الخصم</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>الإجمالي</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">عناصر الطلب</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-right">اسم المنتج</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-left">سعر الوحدة</TableHead>
                <TableHead className="text-left">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-left">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-left font-medium">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
