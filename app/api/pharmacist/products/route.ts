import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import type { ProductsApiResponse } from "@/types/products"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const queryString = request.nextUrl.searchParams.toString()
    const phpPath = `/products${queryString ? `?${queryString}` : ""}`
    const data = await phpFetch<ProductsApiResponse>(phpPath, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
