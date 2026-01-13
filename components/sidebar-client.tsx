"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, Clock, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "إدارة المنتجات",
    icon: Package,
    href: "/products",
  },
  {
    title: "الطلبات",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    title: "سجل الطلبات",
    icon: Clock,
    href: "/orders/history",
  },
  {
    title: "العروض",
    icon: Tag,
    href: "/offers",
  },
  {
    title: "مندوبي التوصيل",
    icon: Users,
    href: "/drivers",
  },
]

export function SidebarClient() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-screen w-64 bg-sidebar border-l border-sidebar-border transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                M
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">MedMarket</span>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                م
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">مورد طبي</p>
                <p className="text-xs text-muted-foreground truncate">supplier@medmarket.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile header */}
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-4 md:hidden">
        <h1 className="text-lg font-bold">MedMarket</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>   
    </>
  )
}
