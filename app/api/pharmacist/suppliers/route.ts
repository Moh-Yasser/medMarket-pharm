import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth } from "@/lib/api/auth-guard"
import {  SuppliersApiResponse } from "@/types/company"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const queryString = request.nextUrl.searchParams.toString()
    const backendPath =  `/companies?type=supplier&${queryString ? `${queryString}` : ""}`
    console.log("yy",backendPath)
    const data = await phpFetch<SuppliersApiResponse>(backendPath, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

