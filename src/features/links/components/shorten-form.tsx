import { useState } from 'react'
import { ArrowRightIcon, LinkIcon, Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShortenFormProps {
  onSubmit: (url: string) => void
  pending?: boolean
  error?: string | null
  defaultValue?: string
  className?: string
  ref?: React.Ref<HTMLInputElement>
}

// The one input the whole product orbits. Pasting submits nothing on its own —
// Enter does — so the user always sees what they're about to shorten.
export function ShortenForm({ onSubmit, pending, error, defaultValue = '', className, ref }: ShortenFormProps) {
  const [value, setValue] = useState(defaultValue)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (value.trim() && !pending) onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div
        className={cn(
          'group flex items-center gap-2 rounded-2xl border bg-card p-2 pl-4 shadow-[0_1px_0_var(--border),0_12px_32px_-16px_oklch(0.22_0.02_265/0.2)] transition-all focus-within:border-foreground/40 focus-within:ring-4 focus-within:ring-highlight/50',
          error && 'border-destructive/60 focus-within:ring-destructive/20',
        )}
      >
        <LinkIcon className="size-5 shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground" />
        <input
          ref={ref}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Paste a long link…"
          aria-label="Long URL"
          aria-invalid={Boolean(error)}
          autoComplete="off"
          spellCheck={false}
          className="h-12 min-w-0 flex-1 bg-transparent font-mono text-[0.95rem] outline-none placeholder:font-sans placeholder:text-muted-foreground/80"
        />
        <kbd className="hidden shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground md:flex">
          ↵ Enter
        </kbd>
        <button
          type="submit"
          disabled={pending || !value.trim()}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 font-medium text-primary-foreground transition-all hover:bg-primary/85 active:translate-y-px disabled:opacity-40"
        >
          {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          <span className="hidden sm:inline">Shorten</span>
          {!pending && <ArrowRightIcon className="size-4" />}
        </button>
      </div>
      <p role="alert" className={cn('mt-2 h-5 pl-4 text-sm text-destructive transition-opacity', !error && 'opacity-0')}>
        {error}
      </p>
    </form>
  )
}
