"use client"

import { type ComponentType } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  RefreshCw,
  Store,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ORDERS_KEYS } from "@/lib/orders/orders-keys"
import { fetchOrderDetail } from "@/lib/orders/orders.client"
import type { Driver, Order, OrderDetailResponse, OrderStatus } from "@/types/orders_cart"
import { OrderDetailsErrorState } from "./order-details-Error"
import { PageLoader } from "@/components/page-loader"
import { ProductPurchaseCardList } from "../pharmacist-purchase/products-purchase-card-list"
import { STATUS_CONFIG } from "../view-status"

type IconType = ComponentType<{ className?: string }>


function formatCurrency(value: unknown) {
  const number = Number(value ?? 0)

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(number) ? number : 0)
}

function formatOrderDate(value?: string | Date | null) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}


function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border bg-background/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6">{value}</p>
    </div>
  )
}

function InvoiceLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}



export function OrderDetailsContent({ orderId }: { orderId: string }) {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<OrderDetailResponse>({
    queryKey: ORDERS_KEYS.details(orderId),
    queryFn: () => fetchOrderDetail(orderId),
  })

  const payload = data?.data
  const order: Order | null = payload ? (payload as Order) : null
 
  const driver: Driver | null = payload
    ? ((payload.driver ?? null) as Driver | null)
    : null

  const status = String(order?.status ?? "pending").toLowerCase() as OrderStatus
  const statusInfo = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending

  if (isLoading) {
    return <PageLoader label="جارٍ تحميل تفاصيل الطلب..." />
  }

  if (isError || !order) {
    return (
      <OrderDetailsErrorState
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    )
  }

  const orderNumber = order.orderNumber || order.id
  const itemsCount = order.items?.length ?? 0
  const pharmacyName = order.buyerCompany?.name ?? "—"
  const pharmacyAddress = order.buyerCompany?.address ?? "—"
  const driverName = driver?.name ?? "لم يتم تعيين سائق بعد"
  const createdAt = formatOrderDate(order.createdAt)

  return (
    <div dir="rtl" className="space-y-5">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit rounded-full px-3  hover:scale-105"
      >
        <Link href="/orders">
          <ArrowRight className="h-4 w-4" />
          العودة إلى السجل
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-4xl border bg-card p-5 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_34%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${statusInfo.badge}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </Badge>

              {isFetching && (
                <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  تحديث البيانات
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                طلب #{orderNumber}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                تفاصيل طلبك: الفاتورة، السائق، ومنتجات السلة.
              </p>
            </div>
          </div>
        </div>
      </section>


      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">معلومات الطلب</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTile
                icon={Store}
                label="الصيدلية"
                value={pharmacyName}
              />

              <DetailTile
                icon={MapPin}
                label="العنوان"
                value={pharmacyAddress}
              />

              <DetailTile
                icon={User}
                label="السائق"
                value={driverName}
              />

              <DetailTile
                icon={CalendarDays}
                label="تاريخ الإنشاء"
                value={createdAt}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ملخص الفاتورة</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-teal/10 to-background p-4">
              <p className="text-xs font-medium text-muted-foreground">
                الإجمالي المستحق
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            <div className="space-y-3">
              <InvoiceLine
                label="المجموع الفرعي"
                value={formatCurrency(order.subtotal)}
              />

              <InvoiceLine
                label="الضريبة"
                value={formatCurrency(order.taxAmount)}
              />

              <Separator />

              <div className="flex items-center justify-between gap-4 text-base font-semibold">
                <span>الإجمالي</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b pb-4">
          <div>
            <CardTitle className="text-base">منتجات الطلب</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              جميع عناصر السلة الخاصة بهذا الطلب
            </p>
          </div>

          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1.5 text-xs font-medium"
          >
            {itemsCount} منتج
          </Badge>
        </CardHeader>

        <CardContent className="p-5">
          <ProductPurchaseCardList
            variant="order"
            items={order.items ?? []}
            emptyMessage="لم يتم العثور على منتجات"
          />
        </CardContent>
      </Card>
    </div>
  )
}