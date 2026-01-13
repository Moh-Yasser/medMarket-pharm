import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrderHistoryContent } from "@/components/order-history-content"

export const metadata: Metadata = {
  title: "سجل الطلبات - MedMarket",
  description: "عرض سجل الطلبات المكتملة والملغاة",
}

export default function OrderHistoryPage() {
  return (
    <DashboardLayout>
      <OrderHistoryContent />
    </DashboardLayout>
  )
}
