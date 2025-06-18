import { cn } from '@udecode/cn'
import { useEffect } from 'react'

import { useCountdown } from '@/hooks/use-countdown'

export function Button({
  index,
  total,
  seconds = 0,
  onClick
}: {
  index: number
  total: number
  onClick: () => void
  seconds?: number
}) {
  const [remainSeconds, ended, restart] = useCountdown(seconds)

  useEffect(() => {
    restart()
  }, [index, restart])
  return (
    <button
      disabled={!ended}
      className={cn(
        'mt-8 h-[44px] w-full rounded-full bg-[#875DFF] p-0 px-4 text-center text-base font-bold leading-[44px] text-white',
        !ended ? 'opacity-25' : ''
      )}
      onClick={onClick}
    >
      {index < total - 1 ? 'Continue' : 'Task Completed'}
      {!ended && `(${remainSeconds}s)`}
    </button>
  )
}
