import type React from "react"
import { SidebarClient } from "@/components/sidebar-client"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     <SidebarClient />
    <div className="flex min-h-screen bg-background">
     

      {/* Main content */}
      <main className="flex-1 md:mr-64 w-full">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
    </>
  )
}
