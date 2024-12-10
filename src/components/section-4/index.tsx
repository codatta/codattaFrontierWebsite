import { cn } from '@udecode/cn'
import { useMemo, useRef, useState } from 'react'

import workIcon1 from '@/assets/works-1.png'
import workIcon2 from '@/assets/works-2.png'
import workIcon3 from '@/assets/works-3.png'

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <h2 className="font-extrabold text-[32px] leading-10 text-center text-white">
        How It Works
      </h2>
      <Cards />
    </div>
  )
}

type TCard = {
  icon: string
  title: string
  titleColor: string
  des: string
}

const CARDS: TCard[] = [
  {
    icon: workIcon1,
    title: 'For AI Developers:',
    titleColor: '#30C341',
    des: 'Open Collaboration Platform Connect directly with data creators-no upfront costs. Permissionless access eliminates opinionated restrictions, allowing everyone to leverage human expertise to advance AI. Share rewards through our royalty model.',
  },
  {
    icon: workIcon2,
    title: 'For Data Creators',
    titleColor: '#3063C3',
    des: 'Open Collaboration Platform Connect directly with data creators-no upfront costs. Permissionless access eliminates opinionated restrictions, allowing everyone to leverage human expertise to advance AI. Share rewards through our royalty model.',
  },
  {
    icon: workIcon3,
    title: 'For Investors',
    titleColor: '#FCC800',
    des: 'Open Collaboration Platform Connect directly with data creators-no upfront costs. Permissionless access eliminates opinionated restrictions, allowing everyone to leverage human expertise to advance AI. Share rewards through our royalty model.',
  },
]
function Cards() {
  const [index, setIndex] = useState<number>(2)
  const card = useMemo(() => {
    return CARDS[index % CARDS.length]
  }, [index])

  return (
    <div>
      <div className="aspect-1 flex-1 items-center justify-center">
        <img src={card.icon} className="w-full" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="tracking-tight">{card.title}</h3>
          <p className="text-[#FFFFFFA3] text-base leading-8 tracking-wide">
            {card.des}
          </p>
        </div>
        <Indicators total={CARDS.length} index={index} className="mt-[80px]" />
      </div>
    </div>
  )
}

function Indicators({
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
