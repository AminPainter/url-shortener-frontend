import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useAuthMutation, type AuthMode } from '../hooks/use-auth-mutation'
import { describeAuthError } from '../lib/auth-errors'

interface AuthFormProps {
  mode: AuthMode
  pendingUrl?: string
  onAuthenticated: () => void
}

const COPY = {
  login: { title: 'Welcome back.', cta: 'Sign in', switchText: 'New here?', switchLabel: 'Create an account', switchTo: '/signup' },
  signup: { title: 'Start cutting.', cta: 'Create account', switchText: 'Have an account?', switchLabel: 'Sign in', switchTo: '/login' },
} as const

export function AuthForm({ mode, pendingUrl, onAuthenticated }: AuthFormProps) {
  const auth = useAuthMutation(mode)
  const [showPassword, setShowPassword] = useState(false)
  const copy = COPY[mode]
  const { message, fields } = auth.isError ? describeAuthError(auth.error, mode) : { message: '', fields: {} }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    auth.mutate(
      { email: String(form.get('email')), password: String(form.get('password')) },
      { onSuccess: onAuthenticated },
    )
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-6xl">{copy.title}</h1>
      {pendingUrl && (
        <p className="mt-4 rounded-xl border border-dashed bg-card px-3 py-2 text-sm text-muted-foreground">
          We’ll shorten <span className="font-mono text-foreground">{pendingUrl.replace(/^https?:\/\//, '').slice(0, 40)}</span>{' '}
          as soon as you’re in.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus className="h-11" aria-invalid={Boolean(fields.email)} />
          {fields.email && <p className="text-sm text-destructive">Enter a valid email address.</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
              minLength={8}
              maxLength={72}
              className="h-11 pr-10"
              aria-invalid={Boolean(fields.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          <p className={cn('text-sm', fields.password ? 'text-destructive' : 'text-muted-foreground')}>8–72 characters.</p>
        </div>

        <p role="alert" className={cn('text-sm text-destructive', !message && 'hidden')}>
          {message}
        </p>

        <button
          type="submit"
          disabled={auth.isPending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/85 active:translate-y-px disabled:opacity-50"
        >
          {auth.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          {copy.cta}
          {!auth.isPending && <ArrowRightIcon className="size-4" />}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {copy.switchText}{' '}
        <Link to={copy.switchTo} search={{ url: pendingUrl }} className="font-medium text-foreground underline decoration-highlight decoration-2 underline-offset-4">
          {copy.switchLabel}
        </Link>
      </p>
    </div>
  )
}
