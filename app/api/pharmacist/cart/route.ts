import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import type { CartApiResponse } from "@/types/orders_cart"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const data = await phpFetch<CartApiResponse>("/cart", { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const data = await phpFetch<CartApiResponse>("/cart", { method: "DELETE" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
