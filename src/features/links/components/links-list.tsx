import { useMemo, useState } from 'react'
import { Loader2Icon, SearchIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Link } from '../api/links-api'
import { LinkRow } from './link-row'

interface LinksListProps {
  links: Link[]
  isPending: boolean
  isError: boolean
  refetch: () => void
  hasNextPage: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean
}

export function LinksList({
  links,
  isPending,
  isError,
  refetch,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: LinksListProps) {
  const [query, setQuery] = useState('')

  // Filters the pages loaded so far; the API has no search yet.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return links
    return links.filter(
      (link) => link.shortCode.toLowerCase().includes(needle) || link.longUrl.toLowerCase().includes(needle),
    )
  }, [links, query])

  function renderBody() {
    if (isPending) {
      return (
        <div className="space-y-3 px-4 py-4 sm:px-5">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-full" />
          ))}
        </div>
      )
    }
    if (isError && links.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 px-5 py-12 text-sm text-muted-foreground">
          Couldn’t load your links.
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )
    }
    if (visible.length === 0) {
      return (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">
          {links.length === 0 ? 'Nothing here yet. Your first link is one paste away.' : `No links match “${query}”.`}
        </p>
      )
    }
    return (
      <ul className="divide-y">
        <AnimatePresence initial={false}>
          {visible.map((link) => (
            <LinkRow key={link.shortCode} link={link} />
          ))}
        </AnimatePresence>
      </ul>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <h2 className="font-display text-2xl">Your links</h2>
        <label className="flex h-9 w-full items-center gap-2 rounded-lg border bg-background px-3 text-sm focus-within:ring-3 focus-within:ring-highlight/50 sm:w-64">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by code or destination"
            aria-label="Filter links"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
      </header>

      {renderBody()}

      {hasNextPage && (
        <div className="flex justify-center border-t px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
            Load more
          </Button>
        </div>
      )}
    </section>
  )
}
