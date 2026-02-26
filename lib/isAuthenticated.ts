import { NextRequest } from "next/server";
import type { MeApiResponse } from "@/types/auth";

const PHP_API_BASE = process.env.PHP_API_BASE!;

export async function isAuthenticated(
  req: NextRequest
): Promise<MeApiResponse | { success: false }> {
  const token = req.cookies.get("access_token")?.value;
  
  if (!token) {
    return { success: false };
  }
  
  try {
    const res = await fetch(`${PHP_API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    
    if (!res.ok) {
      return { success: false };
    }
    
    const data: MeApiResponse = await res.json();
    return data;
  } catch (err) {
    return { success: false };
  }
}