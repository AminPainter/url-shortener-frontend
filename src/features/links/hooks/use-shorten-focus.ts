import { useEffect, useRef } from 'react'
import { onShortenFocusRequest } from '../lib/focus-shorten'

// Focuses the input on "/" (outside other fields) and on command-menu requests.
export function useShortenFocus() {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const focus = () => {
      ref.current?.focus()
      ref.current?.select()
    }
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.key !== '/' || target.closest('input, textarea, [contenteditable=true]')) return
      event.preventDefault()
      focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    const unsubscribe = onShortenFocusRequest(focus)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      unsubscribe()
    }
  }, [])

  return ref
}
