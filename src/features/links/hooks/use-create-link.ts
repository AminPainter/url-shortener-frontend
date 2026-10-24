import { useMutation } from '@tanstack/react-query'
import { sessionStore } from '@/features/auth/lib/session-store'
import { ApiError } from '@/lib/api-client'
import { createShortUrl } from '../api/links-api'
import { linksStore } from '../lib/links-store'
import { normaliseUrl } from '../lib/short-link'

export function useCreateLink() {
  return useMutation({
    mutationFn: async (input: string) => {
      const session = sessionStore.get()
      if (!session) throw new Error('Not signed in')
      const created = await createShortUrl(normaliseUrl(input), session.token)
      const link = { ...created, createdAt: Date.now() }
      linksStore.add(session.userId, link)
      return link
    },
    onError: (error) => {
      // Expired or revoked token: drop the session so the router sends them to login.
      if (error instanceof ApiError && error.status === 401) sessionStore.end()
    },
  })
}
