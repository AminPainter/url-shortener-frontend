import { cn } from '@/lib/utils'

export function UsageMeter({ used, limit, className }: { used: number; limit: number; className?: string }) {
  const percent = Math.min(100, (used / limit) * 100)

  return (
    <div className={cn('space-y-2', className)}>
      <p className="font-mono text-sm tabular-nums">
        {used} / {limit} links
      </p>
      <div
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label="Links used"
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn('h-full rounded-full bg-highlight transition-[width]', used >= limit && 'bg-destructive')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
