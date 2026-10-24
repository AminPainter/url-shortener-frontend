import { apiGet, apiPost } from '@/lib/api-client'

export interface CreatedShortUrl {
  shortCode: string
  longUrl: string
}

export interface Link extends CreatedShortUrl {
  createdAt: number
}

interface ShortUrlsPage {
  items: (CreatedShortUrl & { createdAt: string })[]
  nextCursor: string | null
}

export const createShortUrl = (longUrl: string, token: string) =>
  apiPost<CreatedShortUrl>('/short-urls', { body: { longUrl }, token })

export async function listShortUrls(token: string, cursor?: string) {
  const search = new URLSearchParams({ limit: '100', ...(cursor ? { cursor } : {}) })
  const page = await apiGet<ShortUrlsPage>(`/short-urls?${search}`, { token })
  return {
    items: page.items.map((item): Link => ({ ...item, createdAt: Date.parse(item.createdAt) })),
    nextCursor: page.nextCursor,
  }
}
