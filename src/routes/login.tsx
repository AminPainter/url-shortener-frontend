import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthForm } from '@/features/auth/components/auth-form'
import { AuthShell } from '@/features/auth/components/auth-shell'
import { sessionStore } from '@/features/auth/lib/session-store'
import { validateUrlSearch } from '@/lib/url-search'

export const Route = createFileRoute('/login')({
  validateSearch: validateUrlSearch,
  beforeLoad: ({ search }) => {
    if (sessionStore.get()) throw redirect({ to: '/links', search })
  },
  component: Page,
})

function Page() {
  const { url } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <AuthShell>
      <AuthForm mode="login" pendingUrl={url} onAuthenticated={() => navigate({ to: '/links', search: { url } })} />
    </AuthShell>
  )
}
