import { useNavigate } from '@tanstack/react-router'
import { LayoutListIcon, LogOutIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Session } from '../lib/session-store'
import { sessionStore } from '../lib/session-store'

export function UserMenu({ session }: { session: Session }) {
  const navigate = useNavigate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account"
        className="grid size-8 place-items-center rounded-full border bg-card font-display text-lg uppercase outline-none hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {session.email.charAt(0)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{session.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: '/links' })}>
          <LayoutListIcon /> Your links
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            sessionStore.end()
            navigate({ to: '/' })
          }}
        >
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
