const GLOMO_SDK_URL = 'https://unified-sdk.glomopay.com/index.js'

interface SuccessPayload {
  orderId: string
  paymentId: string
  status: string
  signature: string
}

interface FailurePayload {
  error?: { code?: string; message?: string }
}

interface GlomoCheckout {
  on(event: 'payment.success', handler: (payload: SuccessPayload) => void): void
  on(event: 'payment.failure', handler: (payload: FailurePayload) => void): void
  on(event: 'checkout.closed', handler: () => void): void
  open(): void
}

interface GlomoSdk {
  GlomoCheckoutApi: new (options: { publicKey: string; subscriptionId: string }) => GlomoCheckout
}

export type CheckoutOutcome =
  | { kind: 'success'; payment: SuccessPayload }
  | { kind: 'failure'; message: string | undefined }
  | { kind: 'closed' }

export async function openGlomoCheckout(publicKey: string, subscriptionId: string) {
  const sdk = (await import(/* @vite-ignore */ GLOMO_SDK_URL)) as GlomoSdk
  return new Promise<CheckoutOutcome>((resolve) => {
    const checkout = new sdk.GlomoCheckoutApi({ publicKey, subscriptionId })
    checkout.on('payment.success', (payment) => resolve({ kind: 'success', payment }))
    checkout.on('payment.failure', (failure) => resolve({ kind: 'failure', message: failure.error?.message }))
    checkout.on('checkout.closed', () => resolve({ kind: 'closed' }))
    checkout.open()
  })
}
