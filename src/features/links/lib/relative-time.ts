const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'short' })

const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
  ['week', 4.35],
  ['month', 12],
  ['year', Infinity],
]

export function relativeTime(timestamp: number) {
  let delta = (timestamp - Date.now()) / 1000
  for (const [unit, size] of STEPS) {
    if (Math.abs(delta) < size) return formatter.format(Math.round(delta), unit)
    delta /= size
  }
  return ''
}
