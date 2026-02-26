import axios from "axios";
import { AxiosApi } from "@/lib/api/nextBff.client";


const CATEGORIES_ROUTE = "/api/pharmacist/categories";

import type { CategoriesApiResponse } from "@/types/filters";

export async function getAllCategories(
): Promise<CategoriesApiResponse> {
    try {

        const response = await AxiosApi.get<CategoriesApiResponse>(CATEGORIES_ROUTE);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Request failed";
            throw new Error(message);
        }
        throw error;
    }
}
