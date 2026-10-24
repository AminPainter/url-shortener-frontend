export type FieldErrors = Record<string, string[] | undefined>

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors

  constructor(status: number, message: string, fieldErrors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface RequestOptions {
  body?: unknown
  token?: string | null
}

// All calls go to same-origin /api; Vite proxies to Kong in dev.
export async function apiPost<T>(path: string, { body, token }: RequestOptions = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? response.statusText,
      payload?.errors ?? {},
    )
  }
  return payload as T
}
