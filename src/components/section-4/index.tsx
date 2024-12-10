import { cn } from '@udecode/cn'
import { useMemo, useRef, useState } from 'react'

import { useGSAP } from '@gsap/react'
import ScrollTrigger from 'gsap/ScrollTrigger'

import { CARDS } from './data'

import Card from './card'

export default function Section({ className }: { className?: string }) {
  const [index, setIndex] = useState<number>(0)
  const card = useMemo(() => CARDS[index % CARDS.length], [index])
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // ScrollTrigger.create({
    //   trigger: '.work-section',
    //   start: 'top top',
    //   end: 'bottom center',
    //   onEnter: () => () => {
    //     console.log('onEnter')
    //   },
    //   onEnterBack: () => {
    //     console.log('onEnterBack')
    //   },
    //   pin: true,
    //   pinSpacing: false,
    //   scrub: 1,
    // })
  }, [])

  return (
    <div className={cn('snap-start', className)} ref={containerRef}>
      <div className="sticky top-0 pt-[80px] h-screen">
        <h2 className="font-extrabold text-[32px] leading-10 text-center text-white">
          How It Works
        </h2>
        <Card data={card} total={CARDS.length} index={index} />
      </div>
      <div className="h-screen bg-[red] snap-start"></div>
      <div className="h-screen bg-[green] snap-start"></div>
    </div>
  )
}


