import { useQuery } from '@tanstack/react-query'
import { listPlans } from '../api/subscription-api'

export const usePlans = () =>
  useQuery({
    queryKey: ['plans'],
    queryFn: async () => (await listPlans()).items,
    staleTime: Infinity,
  })
