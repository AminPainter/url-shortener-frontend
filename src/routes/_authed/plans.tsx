import { createFileRoute } from '@tanstack/react-router'
import { PlansPage } from '@/features/subscription/components/plans-page'

export const Route = createFileRoute('/_authed/plans')({
  component: PlansPage,
})
