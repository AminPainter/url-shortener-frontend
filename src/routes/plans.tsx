import { createFileRoute } from '@tanstack/react-router'
import { PlansPage } from '@/features/subscription/components/plans-page'

export const Route = createFileRoute('/plans')({
  component: PlansPage,
})
