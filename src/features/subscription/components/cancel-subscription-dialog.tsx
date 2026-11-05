import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Subscription } from '../api/subscription-api'
import { useCancelSubscription } from '../hooks/use-cancel-subscription'
import { describeBillingError } from '../lib/billing-errors'
import { formatDate } from '../lib/format-price'

export function CancelSubscriptionDialog({ subscription }: { subscription: Subscription }) {
  const cancel = useCancelSubscription()
  const periodEnd = subscription.billing?.currentPeriodEnd

  return (
    <Dialog onOpenChange={() => cancel.reset()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
          Cancel plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal">Cancel {subscription.name}?</DialogTitle>
          <DialogDescription>
            {periodEnd
              ? `You keep ${subscription.linkLimit.toLocaleString()} links until ${formatDate(periodEnd)}. After that you move to Free; existing links keep working.`
              : 'You move to Free when the current period ends. Existing links keep working.'}
          </DialogDescription>
        </DialogHeader>
        {cancel.isError && (
          <p role="alert" className="text-sm text-destructive">
            {describeBillingError(cancel.error)}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep plan</Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={cancel.isPending}
            onClick={() =>
              cancel.mutate(undefined, {
                onSuccess: () => toast.success('Subscription cancelled', { description: 'You won’t be charged again.' }),
              })
            }
          >
            {cancel.isPending && <Loader2Icon className="animate-spin" />}
            Cancel plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
