// Lets the command menu (or anything else) put the cursor in the shorten input.
const EVENT = 'cutitshort:focus-shorten'

export const requestShortenFocus = () => window.dispatchEvent(new Event(EVENT))

export function onShortenFocusRequest(handler: () => void) {
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}
