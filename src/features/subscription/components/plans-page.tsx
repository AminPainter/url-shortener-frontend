import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/hooks/use-session'
import { cn } from '@/lib/utils'
import type { Plan, Subscription } from '../api/subscription-api'
import { usePlans } from '../hooks/use-plans'
import { useSubscription } from '../hooks/use-subscription'
import { UsageMeter } from './usage-meter'

const STARTING_PLAN: Plan['plan'] = 'FREE'

export function PlansPage() {
  const session = useSession()
  const plans = usePlans()
  const subscription = useSubscription()
  const isError = plans.isError || subscription.isError

  function retry() {
    if (plans.isError) plans.refetch()
    if (subscription.isError) subscription.refetch()
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">Plans</p>
        <h1 className="font-display text-5xl sm:text-6xl">
          Pick how many links you <em className="highlighter not-italic sm:italic">need</em>.
        </h1>
        <p className="text-muted-foreground">
          {session
            ? subscription.data
              ? `You’re on ${subscription.data.name}. Plan changes are coming soon.`
              : 'Plan changes are coming soon.'
            : 'Every account starts on Free, no card needed. Paid plans are coming soon.'}
        </p>
      </header>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed p-5">
          <p className="text-sm text-destructive">Couldn’t load plans right now.</p>
          <Button variant="outline" size="sm" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : (
        <section aria-label="Plans" className="grid gap-3 md:grid-cols-3">
          {plans.data
            ? plans.data.map((plan) => (
                <PlanCard key={plan.plan} plan={plan} isSignedIn={Boolean(session)} subscription={subscription.data} />
              ))
            : Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-56 rounded-2xl" />)}
        </section>
      )}
    </div>
  )
}

function PlanCard({ plan, isSignedIn, subscription }: { plan: Plan; isSignedIn: boolean; subscription?: Subscription }) {
  const isCurrent = subscription?.plan === plan.plan
  const isStartingPlan = !isSignedIn && plan.plan === STARTING_PLAN

  return (
    <article
      aria-label={`${plan.name} plan`}
      aria-current={isCurrent || undefined}
      className={cn(
        'flex flex-col gap-6 rounded-2xl border bg-card p-5',
        (isCurrent || isStartingPlan) && 'border-foreground/40 ring-4 ring-highlight/50',
      )}
    >
      <div className="flex h-5 items-center justify-between gap-2">
        <h2 className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">{plan.name}</h2>
        {isCurrent && <Badge>Current plan</Badge>}
        {isStartingPlan && <Badge>Start here</Badge>}
      </div>
      <p>
        <span className="font-display text-6xl tabular-nums">{plan.linkLimit.toLocaleString()}</span>
        <span className="ml-2 text-muted-foreground">links</span>
      </p>
      <div className="mt-auto">
        {isCurrent && subscription ? (
          <UsageMeter used={subscription.linkCount} limit={subscription.linkLimit} />
        ) : isStartingPlan ? (
          <Button size="lg" className="w-full" asChild>
            <Link to="/signup">
              Start free <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        ) : (
          <p className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">Available soon</p>
        )}
      </div>
    </article>
  )
}
