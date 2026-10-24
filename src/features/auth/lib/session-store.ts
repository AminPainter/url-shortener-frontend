export interface Session {
  token: string
  userId: string
  email: string
  expiresAt: number
}

const STORAGE_KEY = 'cutitshort.session'
const listeners = new Set<() => void>()

function decodeClaims(token: string): { sub: string; exp: number } {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(payload))
}

function read(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    return session.expiresAt > Date.now() ? session : null
  } catch {
    return null
  }
}

let current = read()

function emit() {
  listeners.forEach((listener) => listener())
}

export const sessionStore = {
  get: () => current,
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  start(token: string, email: string) {
    const { sub, exp } = decodeClaims(token)
    current = { token, email, userId: sub, expiresAt: exp * 1000 }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    emit()
  },
  end() {
    current = null
    localStorage.removeItem(STORAGE_KEY)
    emit()
  },
}
