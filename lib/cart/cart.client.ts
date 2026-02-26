import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";
import type {  CartApiResponse } from "@/types/orders_cart";

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
  notes?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  notes?: string;
}

const CART_ROUTE = "/api/pharmacist/cart";

export async function getCart(): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.get<CartApiResponse>(CART_ROUTE);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch cart";
      throw new Error(message);
    }
    throw error;
  }
}



export async function addCartItem(
  payload: AddCartItemPayload
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.post<CartApiResponse>(
      `${CART_ROUTE}/items`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add item to cart";
      throw new Error(message);
    }
    throw error;
  }
}

/** PUT /api/pharmacist/cart/items/{id} - Update cart item quantity */
export async function updateCartItem(
  id: string | number,
  payload: UpdateCartItemPayload
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.put<CartApiResponse>(
      `${CART_ROUTE}/items/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update cart item";
      throw new Error(message);
    }
    throw error;
  }
}


export async function removeCartItem(
  id: string | number
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.delete<CartApiResponse>(
      `${CART_ROUTE}/items/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to remove item from cart";
      throw new Error(message);
    }
    throw error;
  }
}


export async function clearCart(): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.delete<CartApiResponse>(CART_ROUTE);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to clear cart";
      throw new Error(message);
    }
    throw error;
  }
}


export async function checkoutCart(supplierId:number): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.post<CartApiResponse>(
      `${CART_ROUTE}/checkout`,
      { supplierId }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to checkout";
      throw new Error(message);
    }
    throw error;
  }
}
