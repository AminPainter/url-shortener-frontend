import { ArrowUpRightIcon, EllipsisIcon, QrCodeIcon, Trash2Icon } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { StoredLink } from '../lib/links-store'
import { relativeTime } from '../lib/relative-time'
import { displayShortLink, hostnameOf, shortLinkFor } from '../lib/short-link'
import { CopyButton } from './copy-button'
import { QrDialog } from './qr-dialog'

interface LinkRowProps {
  link: StoredLink
  onRemove: (shortCode: string) => void
}

export function LinkRow({ link, onRemove }: LinkRowProps) {
  const url = shortLinkFor(link.shortCode)
  const host = hostnameOf(link.longUrl)

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-accent/60 sm:px-5"
    >
      {/* Monogram rather than a fetched favicon: no third-party request leaks destinations. */}
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-lg border bg-background font-display text-xl text-muted-foreground uppercase"
      >
        {host.charAt(0)}
      </span>

      <div className="min-w-0">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-[0.95rem] font-medium tracking-tight decoration-highlight decoration-[3px] underline-offset-4 hover:underline"
        >
          {displayShortLink(link.shortCode)}
        </a>
        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[0.8rem] text-muted-foreground">
          <span className="truncate" title={link.longUrl}>
            {link.longUrl.replace(/^https?:\/\/(www\.)?/, '')}
          </span>
          <span aria-hidden>·</span>
          <time className="shrink-0 font-mono text-[0.72rem]" dateTime={new Date(link.createdAt).toISOString()}>
            {relativeTime(link.createdAt)}
          </time>
        </p>
      </div>

      <div className="flex items-center gap-1">
        <CopyButton value={url} variant="ghost" size="icon" className="opacity-70 group-hover:opacity-100" />
        <QrDialog shortCode={link.shortCode}>
          <Button variant="ghost" size="icon" aria-label="Show QR code" className="hidden opacity-70 group-hover:opacity-100 sm:inline-flex">
            <QrCodeIcon />
          </Button>
        </QrDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More actions" className="opacity-70 group-hover:opacity-100">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <a href={url} target="_blank" rel="noreferrer">
                <ArrowUpRightIcon /> Open short link
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={link.longUrl} target="_blank" rel="noreferrer">
                <ArrowUpRightIcon /> Open destination
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* No delete endpoint exists yet: this only forgets the link locally; it keeps redirecting. */}
            <DropdownMenuItem variant="destructive" onSelect={() => onRemove(link.shortCode)}>
              <Trash2Icon /> Remove from this browser
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.li>
  )
}
