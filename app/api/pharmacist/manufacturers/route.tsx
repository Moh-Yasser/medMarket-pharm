import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import type { ManufacturersApiResponse } from "@/types/filters"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const data = await phpFetch<ManufacturersApiResponse>("/manufacturers", { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
