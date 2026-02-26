import { DataTable } from "@/components/table/Data-table";
import CartColumns from "./cart-columns";
import { Button } from "@/components/ui/button";
import { PriceCode } from "../pharmacist-products/product-price";
import { Trash2, ShoppingBag, Package, ArrowLeft } from "lucide-react";
import { CartItem, ItemBySupplier } from "@/types/orders_cart";
import { cn } from "@/lib/utils";


interface CartDetailsProps {
  groupData:ItemBySupplier, 
  handleSubmitOrder:()=>void,
  orderError:string | null,
  isLoading:boolean
}

export default function CartDetails({ groupData,handleSubmitOrder,orderError,isLoading }: CartDetailsProps) {

  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start">

      {/* ── Order Summary Card ── */}
      <div className="w-full lg:max-w-sm">
        <div className="sticky top-20 overflow-hidden rounded-2xl border bg-card shadow-sm">

          {/* Gradient header */}
          <div className="relative bg-linear-to-l from-primary/10 via-primary/5 to-transparent px-5 py-4">
            <div className="absolute left-0 top-0 h-20 w-20 -translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{groupData.supplier.name}</h3>
                  <p className="text-xs text-muted-foreground">ملخص الطلب</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary details */}
          <div className="space-y-4 p-5">
            <div className="space-y-3">
              {/* Item count */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  عدد المنتجات
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-sm font-semibold tabular-nums">
                  {groupData.itemCount}
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">المجموع الفرعي</span>
                <span className="text-sm font-medium tabular-nums">
                  {groupData.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <PriceCode />
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الخصم</span>
                <span className="text-sm text-muted-foreground italic">لا يوجد خصم</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">الإجمالي</span>
              <span className="text-xl font-bold tabular-nums text-primary">
                {groupData.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <PriceCode className="text-sm" />
              </span>
            </div>

            {/* Checkout button */}
            <Button
              size="lg"
              onClick={handleSubmitOrder}
              disabled={isLoading}
              className={cn(
                "mt-2 w-full gap-2 rounded-xl text-base font-semibold",
                "bg-primary hover:bg-primary/90 shadow-md shadow-primary/20",
                "transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              )}
            >
              تأكيد الطلب
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {orderError && <p className="text-sm text-destructive">{orderError}</p>}
          </div>
        </div>
      </div>

      {/* ── Items Table ── */}
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <DataTable<CartItem>
          columns={CartColumns}
          data={groupData.items}
          ActivatePagination={false}
        />
      </div>
    </div>
  );
}
