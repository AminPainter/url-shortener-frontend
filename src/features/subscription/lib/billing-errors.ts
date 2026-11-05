import { ApiError } from '@/lib/api-client'

export function describeBillingError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Your session expired. Sign in again.'
    if (error.status === 429) return 'Too many attempts. Wait a minute and try again.'
    if (error.errorCode === 'ALREADY_SUBSCRIBED') return 'You already have an active paid plan. Cancel it before switching.'
    if (error.errorCode === 'PROFILE_INCOMPLETE') return 'Add your billing name and address first.'
    if (error.errorCode === 'INVALID_SIGNATURE') return 'We couldn’t verify that payment. If you were charged, it will show up shortly.'
    if (error.errorCode === 'PAYMENT_GATEWAY_ERROR') return 'Our payment provider didn’t respond. Try again in a moment.'
    if (error.errorCode === 'SUBSCRIPTION_NOT_FOUND') return 'There’s no active subscription to cancel.'
    if (error.status === 400) return 'Check the highlighted fields.'
  }
  return 'Something went wrong. Try again in a moment.'
}
