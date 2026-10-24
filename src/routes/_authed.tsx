import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { sessionStore } from '@/features/auth/lib/session-store'

export const Route = createFileRoute('/_authed')({
  beforeLoad: () => {
    if (!sessionStore.get()) throw redirect({ to: '/login', search: {} })
  },
  component: Outlet,
})
