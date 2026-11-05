import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, type ProfileUpdate } from '@/features/auth/api/profile-api'
import { profileQueryKey } from '@/features/auth/hooks/use-profile'
import { useSession } from '@/features/auth/hooks/use-session'
import { confirmCheckout, startCheckout, type BillingInterval, type PaidPlan } from '../api/subscription-api'
import { openGlomoCheckout } from '../lib/glomo-checkout'
import { subscriptionQueryKey } from './use-subscription'

interface CheckoutInput {
  plan: PaidPlan
  interval: BillingInterval
  profile: ProfileUpdate
}

export function useCheckout({ onCheckoutOpen }: { onCheckoutOpen: () => void }) {
  const session = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ plan, interval, profile }: CheckoutInput) => {
      const token = session!.token
      await updateProfile(token, profile)
      const { subscriptionId, publicKey } = await startCheckout(token, plan, interval)
      onCheckoutOpen()
      const outcome = await openGlomoCheckout(publicKey, subscriptionId)
      if (outcome.kind !== 'success') return outcome
      await confirmCheckout(token, {
        subscriptionId,
        paymentId: outcome.payment.paymentId,
        status: outcome.payment.status,
        signature: outcome.payment.signature,
      })
      return outcome
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionQueryKey(session?.userId) })
      queryClient.invalidateQueries({ queryKey: profileQueryKey(session?.userId) })
    },
  })
}
