import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"
import type { CartApiResponse } from "@/types/orders_cart"

const checkoutSchema = z.object({
  supplierId: z.number().int().positive(),
})

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const body = await request.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 422 },
      )
    }
    const data = await phpFetch<CartApiResponse>("/cart/checkout", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
