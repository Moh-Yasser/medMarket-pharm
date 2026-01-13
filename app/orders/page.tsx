import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersContent } from "@/components/orders-content"

export const metadata: Metadata = {
  title: "الطلبات - MedMarket",
  description: "إدارة الطلبات الجديدة وقيد المعالجة",
}

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <OrdersContent />
    </DashboardLayout>
  )
}
