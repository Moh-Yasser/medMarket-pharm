import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OffersContent } from "@/components/offers-content"

export const metadata: Metadata = {
  title: "العروض - MedMarket",
  description: "إدارة العروض والخصومات على المنتجات",
}

export default function OffersPage() {
  return (
    <DashboardLayout>
      <OffersContent />
    </DashboardLayout>
  )
}
