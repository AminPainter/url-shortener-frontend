import { useEffect, useRef, useState } from 'react'
import { useSession } from '@/features/auth/hooks/use-session'
import { useCreateLink } from '../hooks/use-create-link'
import { useLinks } from '../hooks/use-links'
import { useShortenFocus } from '../hooks/use-shorten-focus'
import { describeLinkError } from '../lib/link-errors'
import type { Link } from '../api/links-api'
import { LinkStub } from './link-stub'
import { LinksList } from './links-list'
import { LinksOverview } from './links-overview'
import { ShortenForm } from './shorten-form'

interface LinksDashboardProps {
  // A URL typed on the landing page before signing in; shortened on arrival.
  pendingUrl?: string
  onPendingConsumed?: () => void
}

export function LinksDashboard({ pendingUrl, onPendingConsumed }: LinksDashboardProps) {
  const session = useSession()
  const { links, ...linksQuery } = useLinks()
  const createLink = useCreateLink()
  const inputRef = useShortenFocus()
  const [latest, setLatest] = useState<Link | null>(null)
  const consumed = useRef(false)

  function shorten(url: string) {
    createLink.mutate(url, { onSuccess: setLatest })
  }

  useEffect(() => {
    if (!pendingUrl || consumed.current) return
    consumed.current = true
    shorten(pendingUrl)
    onPendingConsumed?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingUrl])

  const handle = session?.email.split('@')[0]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-5">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
          Signed in as {handle}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl">
          What are we <em className="highlighter not-italic sm:italic">cutting</em> today?
        </h1>
        <ShortenForm
          ref={inputRef}
          onSubmit={shorten}
          pending={createLink.isPending}
          error={createLink.isError ? describeLinkError(createLink.error) : null}
          defaultValue={pendingUrl}
        />
      </header>

      {latest && <LinkStub link={latest} />}

      <LinksOverview links={links} hasMore={linksQuery.hasNextPage} />
      <LinksList links={links} {...linksQuery} />

      <p className="text-center font-mono text-[0.7rem] text-muted-foreground">
        Press <kbd className="rounded border px-1">/</kbd> to shorten,{' '}
        <kbd className="rounded border px-1">⌘K</kbd> for everything else.
      </p>
    </div>
  )
}
