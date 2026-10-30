import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { usePlans } from '../hooks/use-plans'
import { useSubscription } from '../hooks/use-subscription'
import { UsageMeter } from './usage-meter'

export function PlansPage() {
  const plans = usePlans()
  const subscription = useSubscription()

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <header className="space-y-3">
        <p className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">Plans</p>
        <h1 className="font-display text-5xl sm:text-6xl">
          Pick how many links you <em className="highlighter not-italic sm:italic">need</em>.
        </h1>
        <p className="text-muted-foreground">Plan changes are coming soon. Every account starts on Free.</p>
      </header>

      {plans.isError || subscription.isError ? (
        <p className="text-sm text-destructive">Couldn’t load plans right now. Try again in a moment.</p>
      ) : (
        <section aria-label="Plans" className="grid gap-3 md:grid-cols-3">
          {plans.data
            ? plans.data.map((plan) => {
                const isCurrent = subscription.data?.plan === plan.plan
                return (
                  <div
                    key={plan.plan}
                    className={cn(
                      'flex flex-col gap-6 rounded-2xl border bg-card p-5',
                      isCurrent && 'border-foreground/40 ring-4 ring-highlight/50',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                        {plan.name}
                      </span>
                      {isCurrent && <Badge>Current plan</Badge>}
                    </div>
                    <p>
                      <span className="font-display text-6xl tabular-nums">{plan.linkLimit.toLocaleString()}</span>
                      <span className="ml-2 text-muted-foreground">links</span>
                    </p>
                    {isCurrent && subscription.data && (
                      <UsageMeter used={subscription.data.linkCount} limit={subscription.data.linkLimit} />
                    )}
                  </div>
                )
              })
            : Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-48 rounded-2xl" />)}
        </section>
      )}
    </div>
  )
}
