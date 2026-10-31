import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GaugeIcon, HomeIcon, LayoutListIcon, LinkIcon, LogInIcon, LogOutIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { useSession } from '@/features/auth/hooks/use-session'
import { sessionStore } from '@/features/auth/lib/session-store'
import { useLinks } from '@/features/links/hooks/use-links'
import { requestShortenFocus } from '@/features/links/lib/focus-shorten'
import { displayShortLink, shortLinkFor } from '@/features/links/lib/short-link'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const session = useSession()
  const { links } = useLinks()
  const navigate = useNavigate()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((isOpen) => !isOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function run(action: () => void) {
    setOpen(false)
    action()
  }

  async function newLink() {
    await navigate({ to: session ? '/links' : '/' })
    requestAnimationFrame(requestShortenFocus)
  }

  async function copyLink(shortCode: string) {
    await navigator.clipboard.writeText(shortLinkFor(shortCode))
    toast.success('Copied to clipboard', { description: displayShortLink(shortCode) })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command menu" description="Jump anywhere or copy a link">
      {/* This shadcn CommandDialog doesn't include cmdk's root; it must wrap the items. */}
      <Command>
        <CommandInput placeholder="Type a command or search your links…" />
        <CommandList>
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(newLink)}>
              <LinkIcon /> Shorten a link <CommandShortcut>/</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(() => navigate({ to: '/' }))}>
              <HomeIcon /> Home
            </CommandItem>
            {session && (
              <CommandItem onSelect={() => run(() => navigate({ to: '/links' }))}>
                <LayoutListIcon /> Your links
              </CommandItem>
            )}
            <CommandItem keywords={['pricing', 'limits', 'subscription']} onSelect={() => run(() => navigate({ to: '/plans' }))}>
              <GaugeIcon /> Plans
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}>
              <MoonIcon /> Toggle theme
            </CommandItem>
            {session ? (
              <CommandItem onSelect={() => run(() => (sessionStore.end(), navigate({ to: '/' })))}>
                <LogOutIcon /> Sign out
              </CommandItem>
            ) : (
              <CommandItem onSelect={() => run(() => navigate({ to: '/login' }))}>
                <LogInIcon /> Sign in
              </CommandItem>
            )}
          </CommandGroup>
          {links.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Copy a link">
                {links.slice(0, 50).map((link) => (
                  <CommandItem
                    key={link.shortCode}
                    value={`${link.shortCode} ${link.longUrl}`}
                    onSelect={() => run(() => copyLink(link.shortCode))}
                  >
                    <span className="font-mono">{link.shortCode}</span>
                    <span className="truncate text-muted-foreground">{link.longUrl.replace(/^https?:\/\//, '')}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
