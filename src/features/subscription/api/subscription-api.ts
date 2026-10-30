import { apiGet } from '@/lib/api-client'

export interface Plan {
  plan: 'FREE' | 'PRO' | 'BUSINESS'
  name: string
  linkLimit: number
}

export interface Subscription extends Plan {
  linkCount: number
}

export const listPlans = () => apiGet<{ items: Plan[] }>('/plans')

export const getSubscription = (token: string) => apiGet<Subscription>('/subscription', { token })
