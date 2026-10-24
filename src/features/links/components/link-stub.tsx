import { ArrowUpRightIcon, QrCodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { StoredLink } from '../lib/links-store'
import { displayShortLink, hostnameOf, shortLinkFor } from '../lib/short-link'
import { CopyButton } from './copy-button'
import { QrDialog } from './qr-dialog'

interface LinkStubProps {
  link: Pick<StoredLink, 'shortCode' | 'longUrl'> & { createdAt?: number }
  className?: string
}

const ISSUED_FORMAT = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
})

// The signature object: a ticket stub with the short link as the headline and
// a perforated tear-off holding the actions.
export function LinkStub({ link, className }: LinkStubProps) {
  const url = shortLinkFor(link.shortCode)

  return (
    <div
      className={cn(
        'animate-rise relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-[0_1px_0_var(--border),0_24px_48px_-24px_oklch(0.22_0.02_265/0.25)] sm:flex-row sm:stub-notches sm:[--notch-x:calc(100%-11rem)]',
        className,
      )}
    >
      <div className="@container min-w-0 flex-1 p-5 sm:p-6">
        <div className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
          <span>Admit one · short link</span>
          {link.createdAt && <span className="hidden sm:inline">{ISSUED_FORMAT.format(link.createdAt)} IST</span>}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          key={link.shortCode}
          className="animate-collapse-in mt-3 block truncate font-mono text-[clamp(1.1rem,7cqi,2.15rem)] font-medium tracking-tight"
        >
          <span className="highlighter">{displayShortLink(link.shortCode)}</span>
        </a>
        <p className="mt-3 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <span className="shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem] text-foreground">
            {hostnameOf(link.longUrl)}
          </span>
          <span className="truncate" title={link.longUrl}>
            {link.longUrl}
          </span>
        </p>
      </div>

      <div className="relative flex items-center gap-2 border-t border-dashed p-4 sm:w-44 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-l-2 sm:p-5">
        <CopyButton value={url} label="Copy" size="lg" className="flex-1 sm:flex-none" />
        <div className="flex gap-2">
          <QrDialog shortCode={link.shortCode}>
            <Button variant="outline" size="icon-lg" className="sm:flex-1" aria-label="Show QR code">
              <QrCodeIcon />
            </Button>
          </QrDialog>
          <Button variant="outline" size="icon-lg" className="sm:flex-1" asChild>
            <a href={url} target="_blank" rel="noreferrer" aria-label="Open short link">
              <ArrowUpRightIcon />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
