import { Product } from "@/types/products";

export default function ProductPrice({ product }: { product: Product }) {
    if(!product.discountType){
        return (
            <span className="tabular-nums">
                {product.pharmacistPrice}  <PriceCode />
            </span>
        )
    }
    else{
    const price = product.discountType === "fixed" ? product.pharmacistPrice - product.discount : product.pharmacistPrice * (1 - product.discount / 100);
        return (
            <div className="flex items-center justify-center ">
                <span className="ml-2 tabular-nums line-through text-destructive">
                {product.pharmacistPrice } 
            </span>
            <span className="tabular-nums flex items-center gap-1">
                {price.toFixed(0)} <PriceCode />
            </span>
            </div>
        
        )
    }
  
}



type PriceCodeProps = React.HTMLAttributes<HTMLSpanElement>;

export function PriceCode({ className}: PriceCodeProps) {
    return (
        <span className={className ?? "text-xs"} >
            ل.س
        </span>
    );
}
