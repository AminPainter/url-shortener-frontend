import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../api/profile-api'
import { useSession } from './use-session'

export const profileQueryKey = (userId: string | undefined) => ['profile', userId] as const

export function useProfile(enabled = true) {
  const session = useSession()
  return useQuery({
    queryKey: profileQueryKey(session?.userId),
    queryFn: () => getProfile(session!.token),
    enabled: Boolean(session) && enabled,
  })
}
