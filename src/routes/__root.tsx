import { useEffect } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { SiteHeader } from '@/components/layout/site-header'
import { Toaster } from '@/components/ui/sonner'
import { sessionStore } from '@/features/auth/lib/session-store'
import { CommandMenu } from '@/features/command-menu/components/command-menu'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
})

function RootLayout() {
  const router = useRouter()

  // Re-run route guards whenever the session starts or ends (incl. 401 expiry).
  useEffect(() => sessionStore.subscribe(() => router.invalidate()), [router])

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <CommandMenu />
      <Toaster position="bottom-center" />
    </div>
  )
}
