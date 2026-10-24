import { Link } from '@tanstack/react-router'
import { UserMenu } from '@/features/auth/components/user-menu'
import { useSession } from '@/features/auth/hooks/use-session'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

function openCommandMenu() {
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
}

export function SiteHeader() {
  const session = useSession()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-auto flex items-center gap-1.5">
          <button
            onClick={openCommandMenu}
            className="hidden h-8 items-center gap-6 rounded-lg border bg-card px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex"
          >
            Search links
            <kbd className="font-mono text-[0.7rem]">⌘K</kbd>
          </button>
          <ThemeToggle />
          {session ? (
            <>
              <Link
                to="/links"
                className="hidden rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[status=active]:text-foreground sm:block"
              >
                Your links
              </Link>
              <UserMenu session={session} />
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
