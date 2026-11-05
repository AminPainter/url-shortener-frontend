import { useRef } from 'react'
import { Loader2Icon, LockIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProfile } from '@/features/auth/hooks/use-profile'
import { ApiError } from '@/lib/api-client'
import type { BillingInterval, Plan } from '../api/subscription-api'
import { useCheckout } from '../hooks/use-checkout'
import { describeBillingError } from '../lib/billing-errors'
import { COUNTRIES } from '../lib/countries'
import { formatPrice } from '../lib/format-price'

interface BillingDetailsDialogProps {
  plan: Plan | null
  interval: BillingInterval
  onOpenChange: (open: boolean) => void
}

const optional = (value: FormDataEntryValue | null) => String(value ?? '').trim() || undefined

export function BillingDetailsDialog({ plan, interval, onOpenChange }: BillingDetailsDialogProps) {
  const profile = useProfile(Boolean(plan))
  const handedOffToGlomo = useRef(false)
  const checkout = useCheckout({
    onCheckoutOpen: () => {
      handedOffToGlomo.current = true
      onOpenChange(false)
    },
  })
  const fieldErrors = checkout.error instanceof ApiError ? checkout.error.fieldErrors : {}
  const hasFieldErrors = Object.keys(fieldErrors).length > 0
  const address = profile.data?.address

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!plan || plan.plan === 'FREE') return
    const form = new FormData(event.currentTarget)
    handedOffToGlomo.current = false
    checkout.mutate(
      {
        plan: plan.plan,
        interval,
        profile: {
          name: String(form.get('name')).trim(),
          address: {
            addressLine1: String(form.get('addressLine1')).trim(),
            addressLine2: optional(form.get('addressLine2')),
            city: String(form.get('city')).trim(),
            state: String(form.get('state')).trim(),
            country: String(form.get('country')),
            pincode: optional(form.get('pincode')),
          },
        },
      },
      {
        onSuccess: (outcome) => {
          if (outcome.kind === 'success') {
            toast.success(`You’re on ${plan.name}`, { description: 'Your new link limit is live.' })
          } else if (outcome.kind === 'failure') {
            toast.error('Payment didn’t go through', { description: outcome.message ?? 'Try another card.' })
          }
        },
        onError: (error) => {
          if (!handedOffToGlomo.current) return
          toast.error('Couldn’t confirm your payment', { description: describeBillingError(error) })
          checkout.reset()
        },
      },
    )
  }

  return (
    <Dialog open={Boolean(plan)} onOpenChange={(open) => !checkout.isPending && onOpenChange(open)}>
      <DialogContent
        className="sm:max-w-md"
        onCloseAutoFocus={(event) => handedOffToGlomo.current && event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-normal">Billing details</DialogTitle>
          <DialogDescription>
            {plan?.prices
              ? `${plan.name}, ${formatPrice(plan.prices[interval], plan.prices.currency)} per ${interval === 'MONTH' ? 'month' : 'year'}. Card details are entered on the secure checkout next.`
              : null}
          </DialogDescription>
        </DialogHeader>

        {profile.isPending ? (
          <div className="grid h-64 place-items-center">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field id="name" label="Full name" autoComplete="name" defaultValue={profile.data?.name ?? ''} invalid={Boolean(fieldErrors.name)} required />
            <Field id="addressLine1" label="Address" autoComplete="address-line1" defaultValue={address?.addressLine1} required />
            <Field id="addressLine2" label="Address line 2 (optional)" autoComplete="address-line2" defaultValue={address?.addressLine2} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="city" label="City" autoComplete="address-level2" defaultValue={address?.city} required />
              <Field id="state" label="State" autoComplete="address-level1" defaultValue={address?.state} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  name="country"
                  required
                  defaultValue={address?.country ?? 'IND'}
                  className="h-10 w-full rounded-md border bg-transparent px-3 text-sm"
                >
                  {COUNTRIES.map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <Field id="pincode" label="Postal code" autoComplete="postal-code" defaultValue={address?.pincode} />
            </div>

            {checkout.isError && (
              <p role="alert" className="text-sm text-destructive">
                {hasFieldErrors ? 'Check your billing details and try again.' : describeBillingError(checkout.error)}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={checkout.isPending}>
              {checkout.isPending ? <Loader2Icon className="animate-spin" /> : <LockIcon />}
              {checkout.isPending ? 'Preparing checkout…' : 'Continue to payment'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FieldProps {
  id: string
  label: string
  autoComplete: string
  defaultValue?: string
  required?: boolean
  invalid?: boolean
}

function Field({ id, label, autoComplete, defaultValue, required, invalid }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} autoComplete={autoComplete} defaultValue={defaultValue} required={required} maxLength={128} aria-invalid={invalid} />
    </div>
  )
}
