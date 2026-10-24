import { useSyncExternalStore } from 'react'
import { useSession } from '@/features/auth/hooks/use-session'
import { linksStore } from '../lib/links-store'

export function useLinks() {
  const userId = useSession()?.userId
  return useSyncExternalStore(linksStore.subscribe, () => linksStore.get(userId))
}
