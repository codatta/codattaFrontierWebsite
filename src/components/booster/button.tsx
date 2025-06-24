import { motion } from 'framer-motion'
import { cn } from '@udecode/cn'
import { useEffect } from 'react'

import { useCountdown } from '@/hooks/use-countdown'

function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function Button({
  index,
  text = 'Continue',
  seconds = 0,
  onClick,
  className,
  disabled = false,
  loading = false
}: {
  text: string
  onClick: () => void
  index?: number
  seconds?: number
  className?: string
  disabled?: boolean
  loading?: boolean
}) {
  const [remainSeconds, ended, restart] = useCountdown(seconds)
  const isButtonDisabled = !ended || disabled || loading

  useEffect(() => {
    restart()
  }, [index, restart])

  function handleClick() {
    if (isButtonDisabled) return
    onClick()
  }

  return (
    <motion.button
      disabled={isButtonDisabled}
      className={cn(
        'mt-8 flex h-[44px] w-full items-center justify-center rounded-full bg-[#875DFF] p-0 px-4 text-center text-base font-bold leading-[44px] text-white',
        isButtonDisabled ? 'cursor-not-allowed opacity-25' : '',
        className
      )}
      onClick={handleClick}
      whileHover={isButtonDisabled ? {} : { scale: 1.03 }}
      whileTap={isButtonDisabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {loading ? (
        <>
          <LoadingSpinner className="mr-2 animate-spin" />
          {text}
        </>
      ) : (
        <>
          {text}
          {!ended && `(${remainSeconds}s)`}
        </>
      )}
    </motion.button>
  )
}
