import type { StoredLink } from './links-store'
import { hostnameOf } from './short-link'

const DAY_MS = 86_400_000

export interface LinkStats {
  total: number
  thisWeek: number
  topDomain: { host: string; count: number } | null
  domains: number
  daily: number[]
}

// Everything here derives from links created in this browser — the backend
// doesn't expose history or click analytics yet.
export function computeLinkStats(links: StoredLink[], days = 14): LinkStats {
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const daily = Array<number>(days).fill(0)
  const byHost = new Map<string, number>()

  for (const link of links) {
    const daysAgo = Math.floor((startOfToday + DAY_MS - link.createdAt) / DAY_MS)
    if (daysAgo >= 0 && daysAgo < days) daily[days - 1 - daysAgo]++
    const host = hostnameOf(link.longUrl)
    byHost.set(host, (byHost.get(host) ?? 0) + 1)
  }

  const [host, count] = [...byHost].sort((a, b) => b[1] - a[1])[0] ?? []
  return {
    total: links.length,
    thisWeek: daily.slice(-7).reduce((sum, n) => sum + n, 0),
    topDomain: host ? { host, count: count! } : null,
    domains: byHost.size,
    daily,
  }
}
