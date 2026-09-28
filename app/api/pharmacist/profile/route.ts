import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"

export async function GET(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const data = await phpFetch("/profile")
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

export async function PUT(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const body = await req.json()
    const data = await phpFetch("/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

