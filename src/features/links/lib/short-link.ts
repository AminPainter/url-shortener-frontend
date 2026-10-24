const ORIGIN = import.meta.env.VITE_SHORT_LINK_ORIGIN ?? 'http://localhost:9113'

export const shortLinkFor = (shortCode: string) => `${ORIGIN}/${shortCode}`

// "localhost:9113/aB3xY9z" — protocol stripped for display.
export const displayShortLink = (shortCode: string) =>
  shortLinkFor(shortCode).replace(/^https?:\/\//, '')

export function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Accept "example.com/x" by assuming https, as people paste bare domains.
export function normaliseUrl(input: string) {
  const trimmed = input.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
