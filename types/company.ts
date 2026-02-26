import { ApiResponse } from "./api-response";
import { Category, Manufacturer } from "./filters";

  export interface Company {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  address: string ;
  latitude?: number | null;
  longitude?: number | null;
  regionId?: number | null;
  addressLine?: string | null;
  taxId?: string;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier extends Company {
  description: string;
  category: Category[];
  manufacturer: Manufacturer[];
}


export type SuppliersApiResponse = ApiResponse<Supplier>;
export type CompaniesApiResponse = ApiResponse<Company>;
export type SupplierApiResponse ={
  data: Supplier;
  message: string;
  success: boolean;
}