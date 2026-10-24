// Search params shared by routes that can carry a not-yet-shortened URL.
export interface UrlSearch {
  url?: string
}

export const validateUrlSearch = (search: Record<string, unknown>): UrlSearch => ({
  url: typeof search.url === 'string' && search.url ? search.url : undefined,
})
