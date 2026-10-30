export type FieldErrors = Record<string, string[] | undefined>

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors
  readonly errorCode: string | undefined

  constructor(status: number, message: string, fieldErrors: FieldErrors = {}, errorCode?: string) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
    this.errorCode = errorCode
  }
}

interface RequestOptions {
  body?: unknown
  token?: string | null
}

// All calls go to same-origin /api; Vite proxies to Kong in dev.
async function apiRequest<T>(method: 'GET' | 'POST', path: string, { body, token }: RequestOptions): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? response.statusText,
      payload?.errors ?? {},
      payload?.errorCode,
    )
  }
  return payload as T
}

export const apiGet = <T>(path: string, options: RequestOptions = {}) => apiRequest<T>('GET', path, options)

export const apiPost = <T>(path: string, options: RequestOptions = {}) => apiRequest<T>('POST', path, options)
