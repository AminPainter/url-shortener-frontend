import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/features/auth/hooks/use-session'
import { sessionStore } from '@/features/auth/lib/session-store'
import { ApiError } from '@/lib/api-client'
import { getSubscription } from '../api/subscription-api'

export const subscriptionQueryKey = (userId: string | undefined) => ['subscription', userId] as const

export function useSubscription() {
  const session = useSession()
  return useQuery({
    queryKey: subscriptionQueryKey(session?.userId),
    queryFn: async () => {
      try {
        return await getSubscription(session!.token)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) sessionStore.end()
        throw error
      }
    },
    enabled: Boolean(session),
  })
}
