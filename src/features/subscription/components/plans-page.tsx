import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/features/auth/hooks/use-session'
import { cn } from '@/lib/utils'
import type { BillingInterval, Plan, Subscription } from '../api/subscription-api'
import { usePlans } from '../hooks/use-plans'
import { useSubscription } from '../hooks/use-subscription'
import { formatDate, formatPrice } from '../lib/format-price'
import { BillingDetailsDialog } from './billing-details-dialog'
import { CancelSubscriptionDialog } from './cancel-subscription-dialog'
import { UsageMeter } from './usage-meter'

const STARTING_PLAN: Plan['plan'] = 'FREE'

function describeCurrentPlan(subscription: Subscription) {
  const billing = subscription.billing
  if (!billing) return `You’re on ${subscription.name}.`
  if (billing.cancelledAt && billing.validUntil)
    return `You’re on ${subscription.name} until ${formatDate(billing.validUntil)}, then Free.`
  if (billing.status === 'HALTED') return `Your last ${subscription.name} payment failed. Update your card from the Glomo email to keep it.`
  if (billing.currentPeriodEnd) return `You’re on ${subscription.name}. Renews ${formatDate(billing.currentPeriodEnd)}.`
  return `You’re on ${subscription.name}.`
}

export function PlansPage() {
  const session = useSession()
  const plans = usePlans()
  const subscription = useSubscription()
  const [interval, setBillingInterval] = useState<BillingInterval>('MONTH')
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
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
              ? describeCurrentPlan(subscription.data)
              : 'Upgrade any time. Cancel whenever you like.'
            : 'Every account starts on Free, no card needed.'}
        </p>
        <Tabs value={interval} onValueChange={(value) => setBillingInterval(value as BillingInterval)}>
          <TabsList aria-label="Billing interval">
            <TabsTrigger value="MONTH">Monthly</TabsTrigger>
            <TabsTrigger value="YEAR">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
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
                <PlanCard
                  key={plan.plan}
                  plan={plan}
                  interval={interval}
                  isSignedIn={Boolean(session)}
                  subscription={subscription.data}
                  onUpgrade={() => setCheckoutPlan(plan)}
                />
              ))
            : Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-64 rounded-2xl" />)}
        </section>
      )}

      <BillingDetailsDialog plan={checkoutPlan} interval={interval} onOpenChange={(open) => !open && setCheckoutPlan(null)} />
    </div>
  )
}

interface PlanCardProps {
  plan: Plan
  interval: BillingInterval
  isSignedIn: boolean
  subscription?: Subscription
  onUpgrade: () => void
}

function PlanCard({ plan, interval, isSignedIn, subscription, onUpgrade }: PlanCardProps) {
  const isCurrent = subscription?.plan === plan.plan
  const isStartingPlan = !isSignedIn && plan.plan === STARTING_PLAN
  const hasPaidPlan = Boolean(subscription?.billing && !subscription.billing.cancelledAt)
  const canCancel = isCurrent && hasPaidPlan

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
      <div className="space-y-1">
        <p>
          <span className="font-display text-6xl tabular-nums">{plan.linkLimit.toLocaleString()}</span>
          <span className="ml-2 text-muted-foreground">links</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {plan.prices
            ? `${formatPrice(plan.prices[interval], plan.prices.currency)} / ${interval === 'MONTH' ? 'month' : 'year'}`
            : 'Free forever'}
        </p>
      </div>
      <div className="mt-auto space-y-2">
        {isCurrent && subscription ? (
          <>
            <UsageMeter used={subscription.linkCount} limit={subscription.linkLimit} />
            {canCancel && <CancelSubscriptionDialog subscription={subscription} />}
          </>
        ) : isStartingPlan ? (
          <Button size="lg" className="w-full" asChild>
            <Link to="/signup">
              Start free <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        ) : !plan.prices ? null : !isSignedIn ? (
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link to="/signup">
              Sign up to upgrade <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        ) : hasPaidPlan ? (
          <p className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">Cancel your plan to switch</p>
        ) : (
          <Button size="lg" className="w-full" onClick={onUpgrade}>
            Upgrade to {plan.name} <ArrowRightIcon data-icon="inline-end" />
          </Button>
        )}
      </div>
    </article>
  )
}
