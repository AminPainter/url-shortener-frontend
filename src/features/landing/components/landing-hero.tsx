import { useNavigate } from '@tanstack/react-router'
import { useSession } from '@/features/auth/hooks/use-session'
import { LinkStub } from '@/features/links/components/link-stub'
import { ShortenForm } from '@/features/links/components/shorten-form'
import { useShortenFocus } from '@/features/links/hooks/use-shorten-focus'

const SAMPLE = {
  shortCode: 'aB3xY9z',
  longUrl: 'https://example.com/help/articles/how-to-share-long-links-without-breaking-them?ref=dashboard&tab=faq',
}

export function LandingHero() {
  const session = useSession()
  const navigate = useNavigate()
  const inputRef = useShortenFocus()

  // Shortening needs an account; carry the URL through auth so nothing is retyped.
  function handleSubmit(url: string) {
    navigate({ to: session ? '/links' : '/signup', search: { url } })
  }

  return (
    <section className="paper-grain relative overflow-hidden border-b">
      <div className="hairline-grid absolute inset-0 -z-10" />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28">
        <p className="animate-rise mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span className="size-1.5 rounded-full bg-success" /> CutItShort link shortener
        </p>
        <h1 className="animate-rise font-display text-[clamp(3.5rem,11vw,8.5rem)] [animation-delay:60ms]">
          Long links, <br className="sm:hidden" />
          <em className="highlighter">cut short.</em>
        </h1>
        <p className="animate-rise mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:120ms]">
          Paste anything. Get a seven-character link you can copy, scan, and share — before you’ve let go of the keys.
        </p>

        <div className="animate-rise mt-10 w-full max-w-2xl [animation-delay:180ms]">
          <ShortenForm ref={inputRef} onSubmit={handleSubmit} />
        </div>

        <div className="animate-rise relative mt-6 w-full max-w-2xl [animation-delay:260ms]">
          <div aria-hidden className="absolute inset-x-6 -bottom-3 h-full rotate-1 rounded-2xl border bg-card/70" />
          <LinkStub link={SAMPLE} className="relative text-left" />
        </div>
      </div>
    </section>
  )
}
