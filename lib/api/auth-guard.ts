import { NextRequest, NextResponse } from "next/server"


export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("access_token")?.value

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  return null
}


export function validateId(id: string): NextResponse | null {
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 })
  }
  return null
}


export function safeErrorResponse(err: unknown, fallbackStatus = 500) {
  if ( err && typeof err === "object" && "status" in err && "error" in err ) {
    const e = err as {
      status: number
      error: { title: string; message: string }
    }
    return NextResponse.json(
      {
        success: false,
        error: {
          title: e.error.title,
          message: e.error.message,
        },
      },
      { status: e.status },
    )
  }
  return NextResponse.json(
    {
      success: false,
      error: {
        title: "Unexpected Error",
        message: "An unexpected error occurred",
      },
    },
    { status: fallbackStatus },
  )
}