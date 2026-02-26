import { CategoriesApiResponse } from "@/types/filters";
import { phpFetch } from "@/lib/api/php.server";

const CATEGORIES_PATH = "/categories";
export async function getAllCategories (): Promise<CategoriesApiResponse> {
    return phpFetch<CategoriesApiResponse>(CATEGORIES_PATH, { method: "GET" });
  }
