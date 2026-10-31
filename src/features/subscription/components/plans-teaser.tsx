import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlans } from '../hooks/use-plans'

export function PlansTeaser() {
  const plans = usePlans()

  return (
    <section aria-labelledby="plans-teaser-heading" className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="flex flex-col gap-8 rounded-2xl border bg-card p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">Plans</p>
          <h2 id="plans-teaser-heading" className="font-display text-4xl sm:text-5xl">
            Start free. <span className="text-muted-foreground">Grow later.</span>
          </h2>
        </div>

        {!plans.isError && (
          <dl className="flex gap-8">
            {plans.data
              ? plans.data.map((plan) => (
                  <div key={plan.plan} className="space-y-1">
                    <dt className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                      {plan.name}
                    </dt>
                    <dd className="font-display text-3xl tabular-nums">
                      {plan.linkLimit.toLocaleString()}
                      <span className="sr-only"> links</span>
                    </dd>
                  </div>
                ))
              : Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-14 w-16" />)}
          </dl>
        )}

        <Button variant="outline" size="lg" className="self-start md:self-auto" asChild>
          <Link to="/plans">
            See plans <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
