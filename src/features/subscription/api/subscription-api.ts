import { apiGet, apiPost } from '@/lib/api-client'

export type BillingInterval = 'MONTH' | 'YEAR'

export type PaidPlan = 'PRO' | 'BUSINESS'

export interface Plan {
  plan: 'FREE' | PaidPlan
  name: string
  linkLimit: number
  prices: { currency: string; MONTH: number; YEAR: number } | null
}

export interface Billing {
  status: string
  interval: BillingInterval
  currentPeriodEnd: string | null
  cancelledAt: string | null
  validUntil: string | null
}

export interface Subscription extends Plan {
  linkCount: number
  billing: Billing | null
}

export interface CheckoutSession {
  subscriptionId: string
  publicKey: string
}

export interface CheckoutConfirmation {
  subscriptionId: string
  paymentId: string
  status: string
  signature: string
}

export const listPlans = () => apiGet<{ items: Plan[] }>('/plans')

export const getSubscription = (token: string) => apiGet<Subscription>('/subscription', { token })

export const startCheckout = (token: string, plan: PaidPlan, interval: BillingInterval) =>
  apiPost<CheckoutSession>('/billing/checkout', { token, body: { plan, interval } })

export const confirmCheckout = (token: string, confirmation: CheckoutConfirmation) =>
  apiPost<Subscription>('/billing/checkout/confirm', { token, body: confirmation })

export const cancelSubscription = (token: string) => apiPost<Subscription>('/billing/cancel', { token })
