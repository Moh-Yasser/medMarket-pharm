import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import type { OrdersApiResponse } from "@/types/orders_cart"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const queryString = request.nextUrl.searchParams.toString()
    const backendPath = `/orders${queryString ? `?${queryString}` : ""}`
    const data = await phpFetch<OrdersApiResponse>(backendPath, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
