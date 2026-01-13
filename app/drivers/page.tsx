import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DriversContent } from "@/components/drivers-content"

export const metadata: Metadata = {
  title: "مندوبي التوصيل - MedMarket",
  description: "إدارة مندوبي التوصيل ومتابعة أدائهم",
}

export default function DriversPage() {
  return (
    <DashboardLayout>
      <DriversContent />
    </DashboardLayout>
  )
}
