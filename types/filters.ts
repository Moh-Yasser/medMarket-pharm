import { ApiResponse } from "./api-response";

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}
export type CategoriesApiResponse = ApiResponse<Category>;

export interface Manufacturer {
    id: number;
    name: string;
    slug: string;
    description: string;
    country?: string;
    website?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export type ManufacturersApiResponse = ApiResponse<Manufacturer>;


export interface ProductsFilters {
    search?: string;
    category_id?: string;
    manufacturer_id?: string;
    supplier_company_id?: string;
    page?: number | undefined;
    per_page?: number | undefined;
  }



  export interface SuppliersFilters {
    search?: string | undefined;
    category_id?: string | undefined;
    manufacturer_id?: string | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
  }
