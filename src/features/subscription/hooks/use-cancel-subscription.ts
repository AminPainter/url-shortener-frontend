import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/auth/hooks/use-session'
import { cancelSubscription } from '../api/subscription-api'
import { subscriptionQueryKey } from './use-subscription'

export function useCancelSubscription() {
  const session = useSession()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cancelSubscription(session!.token),
    onSuccess: (subscription) => queryClient.setQueryData(subscriptionQueryKey(session?.userId), subscription),
  })
}
