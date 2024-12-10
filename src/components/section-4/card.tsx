import { cn } from '@udecode/cn'

import gridBg from '@/assets/works-grid-bg.png'
import { TCard } from './data'
import Indicators from './Indicators'

export default function Card({
  data,
  total,
  index,
}: {
  data: TCard
  total: number
  index: number
}) {
  return (
    <div>
      <div className="aspect-1 flex-1 items-center justify-center relative">
        <img src={data.icon} className="w-full relative z-10" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
          <img
            src={gridBg}
            className="scale-[1] origin-center min-w-full min-h-full"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="tracking-tight">{data.title}</h3>
          <p className="text-[#FFFFFFA3] text-base leading-8 tracking-wide">
            {data.des}
          </p>
        </div>
        <Indicators total={total} index={index} className="mt-[80px]" />
      </div>
    </div>
  )
}
