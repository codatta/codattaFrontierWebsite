import { StarFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'

import { formatNumber } from '@/utils/str'

function RateItem(props: { value: number; bgColor?: string }) {
  const { value, bgColor } = props

  return (
    <div className="relative">
      <StarFilled className={'text-gray-200'} style={{ color: bgColor }} />
      <div className="absolute left-0 top-0 overflow-hidden" style={{ width: `${value * 100}%` }}>
        <StarFilled />
      </div>
    </div>
  )
}

// export default function ReputationRate(props: {
//   rate: number
//   count?: number
//   gap?: number
//   size?: number
//   color?: string
//   bgColor?: string
//   className?: string
// }) {
//   const { rate = 0, size, color, className } = props

//   const formattedRate = formatNumber(rate, 2)

//   return (
//     <div
//       className={cn('font-zendots text-lg', className)}
//       style={{
//         fontSize: size ? `${size}px` : undefined,
//         color: color
//       }}
//     >
//       {formattedRate}
//     </div>
//   )
// }

/** old version */
export function ReputationRate(props: {
  rate: number
  count?: number
  gap?: number
  size?: number
  color?: string
  bgColor?: string
}) {
  const { rate: rateValue, count: countValue, size, bgColor } = props

  const [rate, setRate] = useState<number>(0)
  const [count, setCount] = useState(countValue || 5)

  useEffect(() => {
    let tempRate = rateValue
    if (Number.isNaN(tempRate)) tempRate = 0
    if (tempRate < 0) tempRate = 0
    if (tempRate > 5) tempRate = 5

    setRate(tempRate)
    setCount(countValue || 5)
  }, [rateValue, countValue])

  function renderRateItems(count: number) {
    const items = []
    for (let i = 0; i < count; i++) {
      const itemRate = Math.min(Math.max(rate - i, 0), 1)
      items.push(<RateItem value={itemRate} key={i} bgColor={bgColor} />)
    }
    return items
  }

  return (
    <div
      className={cn('flex gap-1')}
      style={{
        fontSize: size + 'px',
        color: props.color || 'rgba(255, 168, 0, 0.88)'
      }}
    >
      {renderRateItems(count)}
    </div>
  )
}
