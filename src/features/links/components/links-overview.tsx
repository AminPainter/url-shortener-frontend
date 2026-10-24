import { cn } from '@/lib/utils'
import { computeLinkStats } from '../lib/link-stats'
import type { Link } from '../api/links-api'
import { Sparkline } from './sparkline'

function Tile({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5', className)}>
      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">{label}</span>
      {children}
    </div>
  )
}

export function LinksOverview({ links, hasMore }: { links: Link[]; hasMore: boolean }) {
  const stats = computeLinkStats(links)

  return (
    <section aria-label="Overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile label="Links" className="bg-highlight text-highlight-foreground [&>span]:text-highlight-foreground/70">
        <span className="font-display text-6xl tabular-nums">
          {stats.total}
          {hasMore && '+'}
        </span>
      </Tile>
      <Tile label="This week">
        <span className="font-display text-6xl tabular-nums">{stats.thisWeek}</span>
      </Tile>
      <Tile label="Top destination" className="col-span-2 lg:col-span-1">
        {stats.topDomain ? (
          <div className="min-w-0">
            <p className="truncate font-mono text-lg font-medium">{stats.topDomain.host}</p>
            <p className="text-sm text-muted-foreground">
              {stats.topDomain.count} of {stats.total} links · {stats.domains} domain{stats.domains === 1 ? '' : 's'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Appears after your first link.</p>
        )}
      </Tile>
      <Tile label="Last 14 days" className="col-span-2 lg:col-span-1">
        <Sparkline values={stats.daily} className="h-14 w-full" />
      </Tile>
    </section>
  )
}
