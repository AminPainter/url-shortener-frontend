import { useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { useSession } from '@/features/auth/hooks/use-session'
import { linksStore, type StoredLink } from '../lib/links-store'
import { LinkRow } from './link-row'

interface LinksListProps {
  links: StoredLink[]
}

export function LinksList({ links }: LinksListProps) {
  const userId = useSession()?.userId
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return links
    return links.filter(
      (link) => link.shortCode.toLowerCase().includes(needle) || link.longUrl.toLowerCase().includes(needle),
    )
  }, [links, query])

  function handleRemove(shortCode: string) {
    if (!userId) return
    const removed = links.find((link) => link.shortCode === shortCode)
    linksStore.remove(userId, shortCode)
    toast('Removed from this browser', {
      description: 'The short link still redirects.',
      action: removed && { label: 'Undo', onClick: () => linksStore.add(userId, removed) },
    })
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

      {visible.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">
          {links.length === 0 ? 'Nothing here yet. Your first link is one paste away.' : `No links match “${query}”.`}
        </p>
      ) : (
        <ul className="divide-y">
          <AnimatePresence initial={false}>
            {visible.map((link) => (
              <LinkRow key={link.shortCode} link={link} onRemove={handleRemove} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
