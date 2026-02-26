import { create } from "zustand";
import { Product } from "@/types/products";
import { ProductOffer } from "@/types/Offer";

export interface DialogStore {
  offerDialogStatus: boolean;
  product: Product;
    setViewOffers: (product: Product) => void;
    setCloseOffers: () => void;
    offer: ProductOffer;
    setSelectedOffer: (offer: ProductOffer) => void;
  }

export const useDialogStore = create<DialogStore>((set) => ({
    offerDialogStatus:false,
    product: {} as Product,
    offer: {} as ProductOffer,
    setViewOffers: (product: Product) => set({ offerDialogStatus:true, product: product }),
    setCloseOffers: () => set({ offerDialogStatus:false }),
    setSelectedOffer: (offer: ProductOffer) => set({ offer: offer }),
}));
