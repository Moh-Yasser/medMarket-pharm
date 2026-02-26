"use client"

import { Column } from "@/components/table/Data-table";
import { ViewStatus } from "@/components/view-status";
import { Order } from "@/types/orders_cart";
import {  EyeIcon } from "lucide-react";

export const OrdersColumns: Column<Order>[] = [
  {
    key: "orderNumber",
    label: "رقم الطلب",
    className: "text-right",
    render: (item) => <span className="font-medium">#{item.orderNumber}</span>,
  },
  {
    key: "supplierCompany",
    label: "المستودع",
     render: (item) =>  <span className="text-muted-foreground">
    {item.supplierCompany.name}
  </span>,
  },
  {
    key: "status",
    label: "الحالة",
    render: (item) => (
      <ViewStatus status={item.status} />
    ),
  },
  {
    key: "quantity",
    label: "عدد المنتجات",
    render: (item) => {
      const totalQuantity = item.items.reduce((acc, item) => acc + item.quantity, 0);
      let quantityText = "منتجات";
      if (totalQuantity === 2) {
        quantityText = "منتجان";
      } else if (totalQuantity > 10) {
        quantityText = "منتج";
      }
      
      return(
      <span className="text-muted-foreground">
      {totalQuantity} {quantityText}
      </span>
      )
    }
  },
  {
    key: "totalAmount",
    label: "المبلغ الكلي",
    render: (item) => (
      <span className="text-muted-foreground">
      {item.totalAmount}  ل.س 
      </span>
    ),
  },
  {
    key: "details",
    label: "التفاصيل",
   
    render: (item) => 
    <div className="text-muted-foreground text-xs flex items-center gap-2 hover:cursor-pointer hover:text-primary" >
      <EyeIcon size={16}/> عرض
    </div>,
  },
];

