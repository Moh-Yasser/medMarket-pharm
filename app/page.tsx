import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

export const metadata: Metadata = {
  title: "لوحة التحكم - MedMarket",
  description: "نظرة عامة على أداء المتجر والمبيعات",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
