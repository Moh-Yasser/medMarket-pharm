import axios from "axios"
import { AxiosApi } from "@/lib/api/nextBff.client"
import type {
  ChangePasswordInput,
  ProfileApiResponse,
  UpdateCompanyInput,
  UpdateProfileInput,
} from "@/types/profile"

const PROFILE_ROUTE = "/api/supplier/profile"

type AnyObject = Record<string, unknown>

function toFiniteNumber(value: unknown): number | null | undefined {
  if (value === null) return null
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function normalizeCompany(company: unknown): AnyObject | undefined {
  if (!company || typeof company !== "object") return undefined
  const c = company as AnyObject
  return {
    ...c,
    addressLine: (c.addressLine as string | undefined) ?? (c.address_line as string | undefined) ?? null,
    taxId: (c.taxId as string | undefined) ?? (c.tax_id as string | undefined) ?? null,
    registrationNumber:
      (c.registrationNumber as string | undefined) ?? (c.registration_number as string | undefined) ?? null,
    regionId: (c.regionId as number | undefined) ?? (c.region_id as number | undefined) ?? null,
    latitude: toFiniteNumber(c.latitude),
    longitude: toFiniteNumber(c.longitude),
  }
}

function normalizeProfileResponse(input: unknown): ProfileApiResponse {
  const root = (input && typeof input === "object" ? input : {}) as AnyObject
  const data = (root.data && typeof root.data === "object" ? root.data : root) as AnyObject
  const user = ((data.user as AnyObject | undefined) ?? (data as AnyObject)) as AnyObject
  const company = normalizeCompany((data.company as AnyObject | undefined) ?? user.company)

  return {
    success: Boolean(root.success ?? true),
    message: (root.message as string | undefined) ?? undefined,
    data: {
      user: {
        ...(user as object),
        company: company as ProfileApiResponse["data"]["user"]["company"],
      } as ProfileApiResponse["data"]["user"],
      company: company as ProfileApiResponse["data"]["company"],
    },
  }
}

function normalizeAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    throw new Error(
      (error.response?.data as { message?: string; error?: string } | undefined)?.message ||
        (error.response?.data as { message?: string; error?: string } | undefined)?.error ||
        error.message,
    )
  }
  throw error
}

export async function fetchProfile(): Promise<ProfileApiResponse> {
  try {
    const { data } = await AxiosApi.get<ProfileApiResponse>(PROFILE_ROUTE)
    return normalizeProfileResponse(data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateProfile(input: UpdateProfileInput): Promise<ProfileApiResponse> {
  try {
    const { data } = await AxiosApi.put<ProfileApiResponse>(PROFILE_ROUTE, input)
    return normalizeProfileResponse(data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateCompany(input: UpdateCompanyInput) {
  try {
    const { data } = await AxiosApi.put(`${PROFILE_ROUTE}/company`, input)
    return data
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function changePassword(input: ChangePasswordInput) {
  try {
    const { data } = await AxiosApi.put(`${PROFILE_ROUTE}/password`, input)
    return data
  } catch (error) {
    normalizeAxiosError(error)
  }
}

