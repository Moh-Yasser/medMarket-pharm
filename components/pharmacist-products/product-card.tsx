import { CartItem } from "@/types/orders_cart";
import { Product, ProductsApiResponse } from "@/types/products";
import {
  Building2,
  Package,
  Percent,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { PriceCode } from "./product-price";
import { CartActions } from "../cart-actions";

type ProductCardProps = {
  product: Product;
  cartsItems: Map<number, CartItem>;
};

export default function ProductCard({ product, cartsItems }: ProductCardProps) {
  const cartsItem = cartsItems.get(product.id);
  return (
   
     <Card className="h-full gap-2 overflow-hidden border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
  <Link
    href={`/products/${product.id}`}
    className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  ><CardHeader className="gap-4 pb-7 sm:pd-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package aria-hidden="true" />
            </div>
            {product.offers.length > 0 && (
              <div className="text-accent p-2 rounded-full bg-accent/20">
                <Percent aria-hidden="true" size={18} />
              </div>  
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-foreground">
              {product.name}
            </h2>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {product.category.name} | {product.manufacturer.name}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-169px)] flex-col gap-5 pt-0">
          <div className="flex min-w-0 items-center gap-2 text-muted-foreground text-sm">
            <Building2 aria-hidden="true" size={18} />
            <span className="truncate">{product.supplierCompany.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-muted/55 p-3">
              <div className="mb-1 flex items-center gap-1.5 ">
                <Tag aria-hidden="true" size={14} /> سعر الصيدلي
              </div>
              <p className="font-bold text-foreground">
                {product.pharmacistPrice.toFixed(0)} <PriceCode />
              </p>
            </div>
            <div className="rounded-xl bg-muted/55 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                سعر المستهلك
              </div>
              <p className="font-bold text-foreground">
                {product.customerPrice.toFixed(0)} <PriceCode />
              </p>
            </div>
          </div>
        
        </CardContent>
         </Link>
         <div className=" flex items-center justify-end gap-3 border-t border-border/70 px-6  pt-4 text-sm hover:cursor-pointer">
            <CartActions product={cartsItem ?? product} />
          </div>
      </Card>
    
  );
}
