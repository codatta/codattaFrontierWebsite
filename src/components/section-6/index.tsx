import { cn } from '@udecode/cn'
import { useRef, useState } from 'react'

import DynamicSvg from '../dynamic-svg'
import { CARDS, TCard } from './data'

export default function Section({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToCard = (index: number) => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.snap-start')

    if (index >= 0 && index < cards.length) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
      setCurrentIndex(index)
    }
  }

  const handlePrev = () => {
    scrollToCard(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    scrollToCard(Math.min(CARDS.length - 1, currentIndex + 1))
  }

  return (
    <div className={cn('', className)} ref={containerRef}>
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-[32px] leading-10 text-[#1D1D1D]">
          History
        </h3>
        <div className="w-[112px] flex items-center justify-between">
          <DynamicSvg
            iconName="arrow-right-circle"
            className={cn(
              'w-8 h-8 rotate-180 cursor-pointer',
              currentIndex === 0 ? 'text-[#00000029]' : ''
            )}
            onClick={handlePrev}
          />
          <DynamicSvg
            iconName="arrow-right-circle"
            onClick={handleNext}
            className={cn(
              'w-8 h-8 cursor-pointer',
              currentIndex === CARDS.length - 1 ? 'text-[#00000029]' : ''
            )}
          />
        </div>
      </div>
      <div className="overflow-x-hidden mt-10">
        <div className="w-full snap-x overflow-x-auto scrollbar-hide">
          <div className="flex items-stretch gap-6 flex-nowrap w-max ">
            {CARDS.map((card) => (
              <Card
                data={card}
                className="w-[240px] snap-start"
                key={card.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


function Card({ data, className }: { data: TCard; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl p-10 border border-solid border-[#0000001F]',
        className
      )}
    >
      <h4 className="font-bold text-lg">{data.title}</h4>
      <p className="text-base tracking-wide mt-6">{data.des}</p>
    </div>
  )
}
