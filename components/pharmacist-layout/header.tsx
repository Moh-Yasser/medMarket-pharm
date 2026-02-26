"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Package, Building2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Cart, CartApiResponse } from "@/types/orders_cart"
import { useQuery } from "@tanstack/react-query"
import { CART_KEYS } from "@/lib/cart/cart-keys"
import { getCart } from "@/lib/cart/cart.client"


const navigation = [
  { name: "المنتجات", href: "products", icon: Package },
  { name: "الموردين", href: "suppliers", icon: Building2 },
  { name: "الطلبات", href: "orders", icon: FileText },
]

export function Header() {
  const pathname = usePathname()
 const {data:fetchedData}=useQuery<CartApiResponse>({
queryKey:CART_KEYS.all,
queryFn:getCart,
 } )
 const cartData=fetchedData?.data ?? ({} as Cart);
 const groupCount=cartData.itemsBySupplier?.length;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-lg font-semibold text-foreground">MedMarket</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={`/${item.href}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
                { (groupCount>0) &&<span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  { groupCount }
                </span>}
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
