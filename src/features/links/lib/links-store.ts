import type { CreatedShortUrl } from '../api/links-api'

// The backend has no list endpoint yet, so history lives in this browser, per user.
export interface StoredLink extends CreatedShortUrl {
  createdAt: number
}

const keyFor = (userId: string) => `cutitshort.links.${userId}`
const listeners = new Set<() => void>()
const cache = new Map<string, StoredLink[]>()
const EMPTY: StoredLink[] = []

function load(userId: string): StoredLink[] {
  try {
    return JSON.parse(localStorage.getItem(keyFor(userId)) ?? '[]')
  } catch {
    return EMPTY
  }
}

export const linksStore = {
  get(userId: string | undefined) {
    if (!userId) return EMPTY
    if (!cache.has(userId)) cache.set(userId, load(userId))
    return cache.get(userId)!
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  save(userId: string, links: StoredLink[]) {
    cache.set(userId, links)
    localStorage.setItem(keyFor(userId), JSON.stringify(links))
    listeners.forEach((listener) => listener())
  },
  add(userId: string, link: StoredLink) {
    linksStore.save(userId, [link, ...linksStore.get(userId)])
  },
  remove(userId: string, shortCode: string) {
    linksStore.save(userId, linksStore.get(userId).filter((link) => link.shortCode !== shortCode))
  },
}
