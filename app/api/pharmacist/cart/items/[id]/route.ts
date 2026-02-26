import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, validateId, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"
import type { CartApiResponse } from "@/types/orders_cart"

type Ctx = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  quantity: z.number().int().positive().max(10000),
  notes: z.string().max(500).optional(),
})

export async function PUT(request: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(request)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body", details: parsed.error.flatten() },
        { status: 422 },
      )
    }
    const data = await phpFetch<CartApiResponse>(`/cart/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(request)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const data = await phpFetch<CartApiResponse>(`/cart/items/${id}`, { method: "DELETE" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
