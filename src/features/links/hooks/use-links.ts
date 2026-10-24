import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSession } from '@/features/auth/hooks/use-session'
import { sessionStore } from '@/features/auth/lib/session-store'
import { ApiError } from '@/lib/api-client'
import { listShortUrls, type Link } from '../api/links-api'

const EMPTY: Link[] = []

export const linksQueryKey = (userId: string | undefined) => ['links', userId] as const

export function useLinks() {
  const session = useSession()
  const query = useInfiniteQuery({
    queryKey: linksQueryKey(session?.userId),
    queryFn: async ({ pageParam }) => {
      try {
        return await listShortUrls(session!.token, pageParam)
      } catch (error) {
        // Expired or revoked token: drop the session so the router sends them to login.
        if (error instanceof ApiError && error.status === 401) sessionStore.end()
        throw error
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.nextCursor ?? undefined,
    enabled: Boolean(session),
  })

  const links = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? EMPTY, [query.data])

  return {
    links,
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  }
}
