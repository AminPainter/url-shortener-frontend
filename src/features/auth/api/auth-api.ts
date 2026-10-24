import { apiPost } from '@/lib/api-client'

export interface Credentials {
  email: string
  password: string
}

export const signup = (credentials: Credentials) =>
  apiPost<{ id: string; email: string }>('/auth/signup', { body: credentials })

export const login = (credentials: Credentials) =>
  apiPost<{ accessToken: string }>('/auth/login', { body: credentials })
