export function formatPrice(amountInMinorUnits: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: amountInMinorUnits % 100 === 0 ? 0 : 2,
  }).format(amountInMinorUnits / 100)
}

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(isoDate))
}
