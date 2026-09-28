import { ApiResponse } from "./api-response";
import { User } from "./auth";
import { Company, Supplier } from "./company";
import { ProductOffer } from "./Offer";
import { Product } from "./products";

export type OrdersApiResponse = ApiResponse<Order>;

export type OrderStatus =  "prepared" |"pending" | "accepted" | "shipped" | "delivered" | "cancelled";

export type CartApiResponse={
  success: boolean;
  data: Cart;
  message?: string;
};

export interface Cart{
  id: number,
  itemsBySupplier: ItemBySupplier[],
  hasMultipleSuppliers: boolean,
  suppliersCount: number,
  subtotal: number,
  totalAmount: number
}


export type CatalogProduct = Product & { offers?: ProductOffer[] };

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  buyerCompany: Company;
  supplierCompany: Company;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  acceptedAt: Date | null;
  preparedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemBySupplier {
  supplier: Supplier;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartItem {
  id:number,
  product:Product,
  quantity: number,
  unitPrice: number,
  totalPrice: number,
  appliedOffer?:ProductOffer,
  appliedOfferId?: number,
  notes?: string
}

export interface OrdersFilters {
  supplier?: string;
  status?: OrderStatus | "all";
  from_date?: string;
  to_date?: string;
  page:number;
}

export type DriverStatus = "available" | "On delivery" | "Off";


export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "driver";
  company: Company;
  workStartTime: Date;
  workEndTime: Date;
  employmentStartDate: Date;
  employmentEndDate: Date;
  driverStatus: DriverStatus;
  deliveredOrderCount: number;
  totalOrderCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export interface OrderDetailResponse {
  success: boolean;
  data: Order & {
    driver?: Driver | null;
  };
} 
