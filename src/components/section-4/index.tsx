import { cn } from '@udecode/cn'
import { useEffect, useMemo, useRef } from 'react'
import { useInView } from 'motion/react'

import Card from './card'

export default function Section({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)

  const isCard2Inview = useInView(card2Ref, { amount: 0.6 })
  const isCard3Inview = useInView(card3Ref, { amount: 0.6 })

  const index = useMemo(() => {
    return isCard2Inview ? 1 : isCard3Inview ? 2 : 0
  }, [isCard2Inview, isCard3Inview])

  useEffect(() => {
    console.log(
      'isCard1Inview, isCard2Inview, isCard3Inview',
      isCard2Inview,
      isCard3Inview,
      index
    )
  }, [isCard2Inview, isCard3Inview, index])

  return (
    <div className={cn('snap-start works-box', className)} ref={containerRef}>
      <div className="sticky top-0 pt-[80px] h-screen md:pt-[90px]">
        <h2 className="font-extrabold text-[32px] leading-10 text-center text-white md:font-bold md:text-[56px] md:leading-[68px] md:tracking-tight">
          How It Works
        </h2>
        <Card total={3} index={index} />
      </div>
      <div className="h-screen snap-start" ref={card2Ref}></div>
      <div className="h-screen snap-start" ref={card3Ref}></div>
    </div>
  )
}


