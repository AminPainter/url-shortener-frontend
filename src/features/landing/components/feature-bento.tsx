import { CommandIcon, KeyRoundIcon, QrCodeIcon, ZapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function Tile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('group relative overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-foreground/25', className)}>
      {children}
    </div>
  )
}

function TileTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 font-medium">
      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      {children}
    </h3>
  )
}

export function FeatureBento() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-5xl sm:text-6xl">
          Small links. <br />
          <span className="text-muted-foreground">Serious plumbing.</span>
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Boring where it matters, fast everywhere else.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-6 md:grid-rows-[auto_auto]">
        <Tile className="bg-highlight text-highlight-foreground md:col-span-4 md:row-span-2">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase opacity-70">62⁷ possible codes</p>
          <p className="mt-6 font-display text-[clamp(3.5rem,9vw,6.5rem)] tabular-nums">3.5 trillion</p>
          <p className="mt-4 max-w-md text-[0.95rem] opacity-80">
            Every code is seven characters from a 62-symbol alphabet, drawn with a cryptographically secure generator. No
            sequential IDs, nothing to enumerate.
          </p>
          <div aria-hidden className="mt-8 flex flex-wrap gap-2 font-mono text-sm">
            {['aB3xY9z', 'Q7mN2pK', 'z0Lr8Ve', 'Hc4Tw1s', 'f9JdU6o'].map((code) => (
              <span key={code} className="rounded-lg border border-current/20 px-2.5 py-1">
                {code}
              </span>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-2">
          <TileTitle icon={ZapIcon}>Cached redirects</TileTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Hot links resolve from Redis — no database round-trip on the click path.
          </p>
        </Tile>

        <Tile className="md:col-span-2">
          <TileTitle icon={QrCodeIcon}>QR on every link</TileTitle>
          <p className="mt-2 text-sm text-muted-foreground">Download print-ready PNG or SVG straight from the stub.</p>
        </Tile>

        <Tile className="md:col-span-3">
          <TileTitle icon={CommandIcon}>Keyboard-first</TileTitle>
          <p className="mt-2 text-sm text-muted-foreground">Paste, Enter, copy. Never touch the mouse.</p>
          <div aria-hidden className="mt-5 flex items-center gap-2 font-mono text-sm">
            {['/', '⌘V', '↵', '⌘K'].map((key) => (
              <kbd key={key} className="grid h-9 min-w-9 place-items-center rounded-lg border border-b-[3px] bg-background px-2">
                {key}
              </kbd>
            ))}
          </div>
        </Tile>

        <Tile className="md:col-span-3">
          <TileTitle icon={KeyRoundIcon}>Yours alone</TileTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Links are created under your account with signed RS256 tokens. No anonymous link farms on our domain.
          </p>
        </Tile>
      </div>
    </section>
  )
}
