import { apiPost } from '@/lib/api-client'

export interface CreatedShortUrl {
  shortCode: string
  longUrl: string
}

export const createShortUrl = (longUrl: string, token: string) =>
  apiPost<CreatedShortUrl>('/short-urls', { body: { longUrl }, token })
