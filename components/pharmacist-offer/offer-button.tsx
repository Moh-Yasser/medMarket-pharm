import { useDialogStore } from "@/store/dialog-store";
import { CartItem } from "@/types/orders_cart";
import { Product } from "@/types/products";
import { ProductOffer } from "@/types/Offer";
import { Tag, CheckCircle } from "lucide-react";

/** Safely get offers array from either Product or CartItem */
function getOffers(product: Product | CartItem): ProductOffer[] {
  if ("product" in product && typeof product.product === "object" && product.product !== null) {
    // CartItem → offers live on the nested product
    return (product as CartItem).product.offers ?? [];
  }
  return (product as Product).offers ?? [];
}

/** Safely get the underlying Product for the dialog store */
function getProduct(p: Product | CartItem): Product {
  if ("product" in p && typeof p.product === "object" && p.product !== null) {
    return (p as CartItem).product;
  }
  return p as Product;
}

export default function OfferButton({ product }: { product: Product | CartItem }) {
  const setViewOffers = useDialogStore((state) => state.setViewOffers);

  const offers = getOffers(product);
  const hasAppliedOffer = "appliedOffer" in product && !!(product as CartItem).appliedOffer;

  if (offers.length === 0) {
    return <span className="text-xs italic text-muted-foreground">لا توجد عروض</span>;
  }

  return (
    <button
      onClick={() => setViewOffers(getProduct(product))}
      className={`inline-flex hover:cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
        hasAppliedOffer
          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
    >
      {hasAppliedOffer ? (
        <>
          <CheckCircle className="h-3.5 w-3.5" />
          تمت اضافة عرض
        </>
      ) : (
        <>
          <Tag className="h-3.5 w-3.5" />
          عرض العروض
        </>
      )}
    </button>
  );
}
