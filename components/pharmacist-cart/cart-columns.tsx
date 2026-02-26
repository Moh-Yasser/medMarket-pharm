import { Column } from "@/components/table/Data-table";
  import { CartItem } from "@/types/orders_cart";
import { PriceCode } from "../pharmacist-products/product-price";
import { CartActions } from "@/components/cart-actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import OfferButton from "../pharmacist-offer/offer-button";
import { TrashButton } from "./trash-button";

const CartColumns: Column<CartItem>[] = [
  {
    key: "name",
    label: "اسم المنتج",
    className: "text-right",
    render: (item) => <span className="font-medium">{item.product.name}</span>,
  },
  {
    key: "customerPrice",
    label: "سعر الزبون",
    render: (item) => (
      <span className="tabular-nums flex items-center justify-center gap-1">
        {item.product.customerPrice} <PriceCode />
      </span>
    ),
  },
  {
    key: "unitPrice",
    label: "سعر الوحدة",

    render: (item) => <span >
      {item.product.pharmacistPrice} <PriceCode />
    </span>,
  },
  {
    key: "offer",
    label: " العرض",
    render: (item) =>
      <OfferButton product={item} />
  },
  {
    key: "totalPrice",
    label: "السعر الكلي",
    render: (item) => (
      <span className="text-lg ">
        {item.totalPrice.toFixed(0)} <PriceCode />
      </span>
    ),
  },
  {
    key: "quantity",
    label: "الكمية",
    render: (item) => <CartActions product={item} />,
  },
  {
    key: "actions",
    label:"",
    render: (item) => <TrashButton product={item}/>
  },
]
const status = {
  applied: "bg-green-500/10 text-green-500",
  notActive: "bg-red-50 text-red-700",
  notApplied: "bg-primary/10 text-primary",
}

export default CartColumns;