import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"
import type { CartApiResponse } from "@/types/orders_cart"

const addItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive().max(10000),
  notes: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const body = await request.json()
    const parsed = addItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 422 },
      )
    }
    const data = await phpFetch<CartApiResponse>("/cart/items", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
