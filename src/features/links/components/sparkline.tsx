interface SparklineProps {
  values: number[]
  className?: string
}

export function Sparkline({ values, className }: SparklineProps) {
  const max = Math.max(1, ...values)
  const barWidth = 100 / values.length

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={className} role="img" aria-label="Links created per day">
      {values.map((value, index) => {
        const height = value === 0 ? 1.5 : 4 + (value / max) * 36
        return (
          <rect
            key={index}
            x={index * barWidth + barWidth * 0.18}
            y={40 - height}
            width={barWidth * 0.64}
            height={height}
            rx={1}
            className={value === 0 ? 'fill-border' : index === values.length - 1 ? 'fill-highlight' : 'fill-foreground/80'}
          >
            <title>{`${value} link${value === 1 ? '' : 's'}`}</title>
          </rect>
        )
      })}
    </svg>
  )
}
