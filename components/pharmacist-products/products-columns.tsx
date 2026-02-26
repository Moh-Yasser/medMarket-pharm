"use client"

import { Product } from "@/types/products";
import { CartItem } from "@/types/orders_cart";
import { Column } from "@/components/table/Data-table";
import { CartActions } from "@/components/cart-actions";
import ProductPrice, { PriceCode } from "./product-price";
import OfferButton from "../pharmacist-offer/offer-button";

export function createProductsColumns(
  cartByProductId: Map<number, CartItem>
): Column<Product>[] {
  return [
    {
      key: "name",
      label: "اسم المنتج",
      className: "text-right",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "supplierCompany",
      label: "المورد",
      className: "text-right",
      render: (item) => (
        <span>
          {item.supplierCompany.name}
        </span>
      ),
    },
    {
      key: "category",
      label: "الصنف",
      className: "text-right",
      render: (item) => (
        <span className="text-muted-foreground">{item.category.name}</span>
      ),
    },
    {
      key: "manufacturer",
      label: "الشركة المصنعة",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.manufacturer.name}
        </span>
      ),
    },
    {
      key: "offers",
      label: "العرض",
      sortable: true,
      render: (item) => {
        const cartItem = cartByProductId.get(item.id);
        return <OfferButton product={cartItem ?? item} />;
      },
    },
    {
      key: "customerPrice",
      label: "سعر العميل",
      sortable: true,
      render: (item) => (
        <span className="tabular-nums flex items-center justify-center gap-1">
          {item.customerPrice.toFixed(0)} <PriceCode />
        </span>
      ),
    },
    {
      key: "pharmacistPrice",
      label: "سعر الصيدلي",
      sortable: true,
      render: (item) => <ProductPrice product={item} />,
    },
    {
      key: "actions",
      label: "اضافة الى السلة",
      sortable: true,
      render: (item) => {
        const cartItem = cartByProductId.get(item.id);
        return <CartActions product={cartItem ?? item} />;
      },
    },
  ];
}
