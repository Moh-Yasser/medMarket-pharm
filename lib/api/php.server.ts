import { cookies } from "next/headers";


const PHP_API_BASE = process.env.PHP_API_BASE!;

export class PhpApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function phpFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get("access_token")?.value;

  const headers = new Headers(options.headers);

  if (!headers.has("Authorization") && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (options.body && !headers.get("Content-Type"))
    headers.set("Content-Type", "application/json");

  const res = await fetch(`${PHP_API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error?: string }).error || "")
        : `PHP API error (${res.status})`;
    throw new PhpApiError(
      res.status,
      message || `PHP API error (${res.status})`,
      data,
    );
  }

  return data as T;
}
