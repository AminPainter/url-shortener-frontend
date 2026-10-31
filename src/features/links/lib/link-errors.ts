import { ApiError } from '@/lib/api-client'

export function describeLinkError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.fieldErrors.longUrl) return 'That doesn’t look like a valid http(s) link.'
    if (error.status === 401) return 'Your session expired. Sign in again.'
    if (error.errorCode === 'LINK_LIMIT_REACHED') return 'You’ve used every link on your plan. Compare limits on the Plans page.'
  }
  return 'Couldn’t shorten that right now. Try again in a moment.'
}
