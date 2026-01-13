import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductsContent } from "@/components/products-content"

export const metadata: Metadata = {
  title: "إدارة المنتجات - MedMarket",
  description: "إضافة وتعديل وحذف المنتجات الطبية",
}

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <ProductsContent />
    </DashboardLayout>
  )
}
