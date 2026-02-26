import { CartApiResponse } from "@/types/orders_cart";
import { phpFetch } from "../api/php.server";

const CART_PATH = "api/pharmacist/cart";

export async function getCart (): Promise<CartApiResponse> {
    return phpFetch<CartApiResponse>(CART_PATH, { method: "GET" });
  }