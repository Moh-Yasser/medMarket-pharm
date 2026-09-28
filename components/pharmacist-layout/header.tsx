"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, Building2, FileText, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/api/auth"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Cart, CartApiResponse } from "@/types/orders_cart"
import { useQuery } from "@tanstack/react-query"
import { CART_KEYS } from "@/lib/cart/cart-keys"
import { getCart } from "@/lib/cart/cart.client"

const navigation = [
  { name: "المنتجات", href: "products", icon: Package },
  { name: "الموردين", href: "suppliers", icon: Building2 },
  { name: "الطلبات", href: "orders", icon: FileText },
]

function Logo() {
  return (
    <div  className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">M</span>
      </div>
      <span className="text-lg font-semibold text-foreground">MedMarket</span>
    </div>
  )
}

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-medium leading-none tabular-nums text-primary-foreground">
      {count > 9 ? "9+" : count}
    </span>
  )
}

function CartIconButton({ count }: { count: number }) {
  return (
    <Button variant="navigation" size="icon" className="relative " asChild>
      <Link href="/cart" aria-label="السلة">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -end-1">
            <CartBadge count={count} />
          </span>
        )}
      </Link>
    </Button>
  )
}

export function Header() {
  const pathname = usePathname()
  const { data: fetchedData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  })
  const cartData = fetchedData?.data ?? ({} as Cart)
  const groupCount = cartData.itemsBySupplier?.length ?? 0

  const isActiveHref = (href: string) =>
    pathname === `/${href}` || pathname.startsWith(`/${href}/`)

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = "/login"
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Right-hand cluster: brand + nav on desktop, sidebar trigger on mobile */}
        <div className="flex min-w-0 items-center gap-8">
          <div className="hidden items-center gap-8 md:flex">
            <Logo />
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = isActiveHref(item.href)
                return (
                  <Link
                    key={item.name}
                    href={`/${item.href}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary hover:text-primary-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Mobile sidebar trigger — the right-most element in the header on mobile */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="navigation" size="icon" aria-label="القائمة">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex w-72 flex-col p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
                  <SheetDescription className="sr-only">
                    روابط التنقل الرئيسية
                  </SheetDescription>
                  <Logo />
                </SheetHeader>

                <nav className="flex flex-1 flex-col gap-1 p-4">
                  {navigation.map((item) => {
                    const isActive = isActiveHref(item.href)
                    return (
                      <SheetClose asChild key={item.name}>
                        <Link
                          href={`/${item.href}`}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    )
                  })}
                </nav>

                <div className="border-t p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    تسجيل الخروج
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Left-hand cluster: cart shortcut, visible at every breakpoint */}
        <CartIconButton count={groupCount} />
      </div>
    </header>
  )
}