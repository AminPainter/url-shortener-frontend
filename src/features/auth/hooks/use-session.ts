import { useSyncExternalStore } from 'react'
import { sessionStore } from '../lib/session-store'

export const useSession = () => useSyncExternalStore(sessionStore.subscribe, sessionStore.get)
