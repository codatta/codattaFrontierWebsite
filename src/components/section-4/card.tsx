import { useMemo } from 'react'

import { cn } from '@udecode/cn'

import Indicators from './indicators'

import gridBg from '@/assets/works-grid-bg.png'
import { CARDS } from './data'


export default function Card({
  total,
  index,
}: {
  total: number
  index: number
}) {
  const data = useMemo(() => {
    return CARDS[index]
  }, [index])

  return (
    <div>
      <div className="aspect-1 flex-1 items-center justify-center relative">
        <div>
          {CARDS.map(({ icon }, i) => (
            <img
              src={icon}
              className={cn('w-full ', index === i ? 'visible' : 'hidden')}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
          <img
            src={gridBg}
            className="scale-[1] origin-center min-w-full min-h-full"
            alt="Grid Background"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h3 className={`tracking-tight ${data.titleColor}`}>{data.title}</h3>
          <p className="text-[#FFFFFFA3] text-base leading-8 tracking-wide">
            {data.des}
          </p>
        </div>
        <Indicators total={total} index={index} className="mt-[80px]" />
      </div>
    </div>
  )
}
