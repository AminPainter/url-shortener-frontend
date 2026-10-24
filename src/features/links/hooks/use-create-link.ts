import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionStore } from '@/features/auth/lib/session-store'
import { ApiError } from '@/lib/api-client'
import { createShortUrl, type Link } from '../api/links-api'
import { normaliseUrl } from '../lib/short-link'
import { linksQueryKey } from './use-links'

export function useCreateLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: string): Promise<Link> => {
      const session = sessionStore.get()
      if (!session) throw new Error('Not signed in')
      const created = await createShortUrl(normaliseUrl(input), session.token)
      return { ...created, createdAt: Date.now() }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: linksQueryKey(sessionStore.get()?.userId) }),
    onError: (error) => {
      // Expired or revoked token: drop the session so the router sends them to login.
      if (error instanceof ApiError && error.status === 401) sessionStore.end()
    },
  })
}
