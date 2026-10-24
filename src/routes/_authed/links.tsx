import { createFileRoute } from '@tanstack/react-router'
import { LinksDashboard } from '@/features/links/components/links-dashboard'
import { validateUrlSearch } from '@/lib/url-search'

export const Route = createFileRoute('/_authed/links')({
  validateSearch: validateUrlSearch,
  component: Page,
})

function Page() {
  const { url } = Route.useSearch()
  const navigate = Route.useNavigate()

  return <LinksDashboard pendingUrl={url} onPendingConsumed={() => navigate({ search: {}, replace: true })} />
}
