import axios, { AxiosInstance } from "axios";
import { PhpApiError, BackendErrorBody } from "@/lib/error";

export const AxiosApi: AxiosInstance = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new PhpApiError(0, "Request Failed", error.message);
    }
    const body = error.response.data as Partial<BackendErrorBody>;
    throw new PhpApiError(
      error.response.status,
      body.error   ?? "Unexpected Error",
      body.message ?? "An unexpected error occurred",
      body.errors,
    );
  }
  throw error;
}