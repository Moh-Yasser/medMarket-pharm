import { ApiResponse, PaginationType } from "./api-response";
import { Product } from "./products";

export interface ProductOffer {
        id: number;
        name: string;
        description: string;
        offerType: OfferType;
        discountValue: number;
        quantityRequired: number | null;
        quantityFree: number | null;
        startDate: string;
        endDate: string;
        isActive: boolean;
        isCurrentlyActive: boolean;
        products:Product[];
        pivot?: {
            quantityRequired: number | null;
            quantityFree: number | null;
            discountOverride: number | null;
            discountTypeOverride: string | null;
        };
}

export type OfferStatus = "live" | "scheduled" | "expired" | "paused";

export const OFFER_TYPES = [
    "fixed_discount",
    "percentage_discount",
    "bundle_fixed",
    "bundle_percentage",
    "buy_x_get_y",
  ] as const
  
  export type OfferType = (typeof OFFER_TYPES)[number]
  
  export interface CreateOfferPayload {
    name: string
    description?: string
    offer_type: OfferType
    discount_value?: number
    quantity_required?: number
    quantity_free?: number
    is_active:boolean
    start_date: string
    end_date?: string
   
  }
  

export interface createOfferType extends CreateOfferPayload{
  product_ids: number[]
}
  
export interface createBundleOfferType extends CreateOfferPayload{
  product_ids: number[]
  products: {
    product_id: number
    quantity: number
  }[]
}
  
export type OffersApiResponse = ApiResponse<ProductOffer>

export interface OfferApiResponse {
  success: boolean;
  data:ProductOffer ;
  pagination?: PaginationType;
  message: string;
}

export interface SupplierOffersFilters {
  offer_type?: string
  is_active?: string
}


export interface ProductOffer {
        id: number;
        name: string;
        description: string;
        offerType: OfferType;
        discountValue: number;
        discountType: string;
        quantityRequired: number | null;
        quantityFree: number | null;
        startDate: string;
        endDate: string;
        isActive: boolean;
        isCurrentlyActive: boolean;
        pivot?: {
            quantityRequired: number | null;
            quantityFree: number | null;
            discountOverride: number | null;
            discountTypeOverride: string | null;
        };
}