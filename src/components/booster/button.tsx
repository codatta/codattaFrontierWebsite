import { cn } from '@udecode/cn'
import { useEffect } from 'react'

import { useCountdown } from '@/hooks/use-countdown'

export function Button({
  index,
  text = 'Continue',
  seconds = 0,
  onClick,
  className,
  disabled = false
}: {
  text: string
  onClick: () => void
  index?: number
  seconds?: number
  className?: string
  disabled?: boolean
}) {
  const [remainSeconds, ended, restart] = useCountdown(seconds)

  useEffect(() => {
    restart()
  }, [index, restart])

  return (
    <button
      disabled={!ended || disabled}
      className={cn(
        'mt-8 h-[44px] w-full rounded-full bg-[#875DFF] p-0 px-4 text-center text-base font-bold leading-[44px] text-white',
        !ended || disabled ? 'cursor-not-allowed opacity-25' : '',
        className
      )}
      onClick={() => ended && !disabled && onClick()}
    >
      {text}
      {!ended && `(${remainSeconds}s)`}
    </button>
  )
}
