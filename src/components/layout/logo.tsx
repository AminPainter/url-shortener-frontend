import { Link } from '@tanstack/react-router'

export function Logo() {
  return (
    <Link to="/" className="group flex items-baseline gap-0.5 text-foreground" aria-label="CutItShort home">
      <span className="font-display text-[1.7rem] leading-none">CutIt</span>
      <span className="rounded-md bg-highlight px-1.5 py-0.5 font-mono text-xs font-medium text-highlight-foreground transition-transform group-hover:-rotate-3">
        Short
      </span>
    </Link>
  )
}
