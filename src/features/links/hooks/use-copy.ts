import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopy(resetAfterMs = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), resetAfterMs)
    },
    [resetAfterMs],
  )

  return { copied, copy }
}
