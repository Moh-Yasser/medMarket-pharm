import { ClipboardList, PackageSearch, ShoppingCart } from "lucide-react";

import { ProductPurchaseCard } from "./product-purchase-card";
import { CartItem, CatalogProduct } from "@/types/orders_cart";

const WRAP_CLASS = "flex flex-wrap gap-4";
const ITEM_CLASS = "w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-3rem)/4)]";

function ProductPurchaseCardEmpty({ message, icon }: { message: string; icon: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-12 text-center">
      {icon}
      <p className="font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export type ProductPurchaseCardListProps = { emptyMessage?: string } & (
  | { variant: "cart"; items: CartItem[] }
  | {
      variant: "order";
      items: CartItem[];
      onReorder?: (item: CartItem) => void;
      reorderingId?: number | null;
    }
);

export function ProductPurchaseCardList(props: ProductPurchaseCardListProps) {
  const { emptyMessage } = props;

 

  if (props.variant === "cart") {
    if (props.items.length === 0) {
      return (
        <div className={WRAP_CLASS}>
          <ProductPurchaseCardEmpty
            message={emptyMessage ?? "سلتك فارغة"}
            icon={<ShoppingCart className="size-8 text-muted-foreground" aria-hidden="true" />}
          />
        </div>
      );
    }
    return (
      <div className={WRAP_CLASS}>
        {props.items.map((item) => (
          <div key={item.id}  className={ITEM_CLASS}>
            <ProductPurchaseCard variant="cart" item={item} />
          </div>
        ))}
      </div>
    );
  }

  // variant === "order"
  if (props.items.length === 0) {
    return (
      <div className={WRAP_CLASS}>
        <ProductPurchaseCardEmpty
          message={emptyMessage ?? "لا توجد طلبات سابقة"}
          icon={<ClipboardList className="size-8 text-muted-foreground" aria-hidden="true" />}
        />
      </div>
    );
  }
  return (
    <div className={WRAP_CLASS}>
      {props.items.map((item) => (
        <div key={item.id} className={ITEM_CLASS}>
          <ProductPurchaseCard
            variant="order"
            item={item}
            onReorder={props.onReorder}
            isReordering={props.reorderingId === item.id}
          />
        </div>
      ))}
    </div>
  );
}