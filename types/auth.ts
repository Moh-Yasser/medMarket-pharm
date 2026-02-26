/**
 * Authentication-related types matching the PHP API response structure
 */

export type UserRole = "buyer" | "supplier";

export interface Company {
  id: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  tax_id: string;
  registration_number: string;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: UserRole;
}


export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}


export interface ApiErrorResponse {
  success?: false;
  message?: string;
  error?: string;
}


export type LoginActionResult =
  | { success: true; user: User }
  | { success: false; error: string };


export interface MeApiResponse {
  success: boolean;
  message?: string;
  data:  User;
}

