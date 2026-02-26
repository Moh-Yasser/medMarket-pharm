
export interface ProductOffer {
        id: number;
        name: string;
        description: string;
        offerType: string;
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
