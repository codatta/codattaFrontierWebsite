import { cn } from '@udecode/cn'
import { useMemo, useRef } from 'react'

export default function Indicators({
  total,
  index,
  className,
}: {
  total: number
  index: number
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rect: { width: number; left: number } = useMemo(() => {
    if (!containerRef.current) return { width: 0, left: 0 }

    const container = containerRef.current
    const indicators = container.querySelectorAll('.indicator')

    if (!indicators.length) return { width: 0, left: 0 }

    const indicatorWidth = indicators[0].getBoundingClientRect().width

    return {
      width: indicatorWidth,
      left:
        indicators[index].getBoundingClientRect().left -
        container.getBoundingClientRect().left,
    }
  }, [containerRef, index, total])

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 relative',
        className
      )}
      ref={containerRef}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-2 rounded-full bg-white/30 flex-1 indicator"
        />
      ))}
      <div
        className="absolute top-0 h-2 rounded-full bg-white transition-all duration-300 move-indicator"
        style={{
          width: rect.width,
          left: rect.left,
        }}
      />
    </div>
  )
}
