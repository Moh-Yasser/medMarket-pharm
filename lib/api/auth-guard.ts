import { NextRequest, NextResponse } from "next/server"

/**
 * Validates that the request has a valid access_token cookie.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("access_token")?.value

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  return null
}

/**
 * Validates that a dynamic route ID parameter is a safe integer string.
 */
export function validateId(id: string): NextResponse | null {
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 })
  }
  return null
}

/**
 * Safely formats an error for the client without leaking internals.
 */
export function safeErrorResponse(err: unknown, fallbackStatus = 500) {
  if (err && typeof err === "object" && "status" in err && "message" in err) {
    const e = err as { status: number; message: string }
    return NextResponse.json(
      { success: false, error: e.message },
      { status: e.status },
    )
  }
  return NextResponse.json(
    { success: false, error: "An unexpected error occurred" },
    { status: fallbackStatus },
  )
}
