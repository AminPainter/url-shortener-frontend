import { apiGet, apiPatch } from '@/lib/api-client'

export interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  pincode?: string
}

export interface Profile {
  id: string
  email: string
  name: string | null
  address: Address | null
}

export interface ProfileUpdate {
  name: string
  address: Address
}

export const getProfile = (token: string) => apiGet<Profile>('/auth/me', { token })

export const updateProfile = (token: string, profile: ProfileUpdate) =>
  apiPatch<Profile>('/auth/me', { token, body: profile })
