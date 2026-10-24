import { useMutation } from '@tanstack/react-query'
import { login, signup, type Credentials } from '../api/auth-api'
import { sessionStore } from '../lib/session-store'

export type AuthMode = 'login' | 'signup'

// Signup doesn't return a token, so a successful signup logs straight in.
export function useAuthMutation(mode: AuthMode) {
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      if (mode === 'signup') await signup(credentials)
      const { accessToken } = await login(credentials)
      sessionStore.start(accessToken, credentials.email.toLowerCase())
    },
  })
}
