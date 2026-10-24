import { ApiError, type FieldErrors } from '@/lib/api-client'
import type { AuthMode } from '../hooks/use-auth-mutation'

export function describeAuthError(error: unknown, mode: AuthMode): { message: string; fields: FieldErrors } {
  if (!(error instanceof ApiError)) return { message: 'Network hiccup. Check your connection and retry.', fields: {} }
  if (error.status === 409) return { message: 'That email already has an account. Sign in instead?', fields: {} }
  if (error.status === 401) {
    return { message: mode === 'signup' ? 'Account created, but sign-in failed. Try logging in.' : 'Email or password is incorrect.', fields: {} }
  }
  if (error.status === 400) return { message: '', fields: error.fieldErrors }
  return { message: 'Something went wrong on our side. Try again shortly.', fields: {} }
}
