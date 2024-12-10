import { cn } from '@udecode/cn'
import { useRef } from 'react'

import { CARDS, TCard } from './data'

import checkCircleIcon from '@/assets/check-circle.svg'
import { motion, useScroll } from 'motion/react'

export default function Section({ className }: { className?: string }) {
  return (
    <section className={cn('text-white', className)}>
      <h2 className="font-extrabold text-[32px] leading-10 text-center">
        Codatta Platform
        <br />
        Roadmap
      </h2>
      <Cards />
    </section>
  )
}

function Cards() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: carouselRef,
    offset: ['start end', 'end end'],
  })

  scrollYProgress.on('change', (latest) => {
    console.log('Scroll progress:', latest)
  })

  return (
    <div className="mt-[80px] flex gap-10" ref={carouselRef}>
      <div className="w-[2px] bg-[#2B2B2B] overflow-hidden">
        <motion.div
          className="h-[120px] bg-gradient-to-b from-[#2B2B2B] to-[#4190FF]"
          style={{ y: scrollYProgress }}
        ></motion.div>
      </div>
      <div className="flex-1">
        {CARDS.map((card, index) => (
          <Card
            data={card}
            className={index !== 0 ? 'mt-[160px] snap-start' : ''}
            key={card.title}
          />
        ))}
      </div>
    </div>
  )
}

function Card({ data, className }: { data: TCard; className?: string }) {
  return (
    <div className={cn('', className)}>
      <div className="flex justify-between items-center">
        <div className="rounded-full text-base leading-[34px] px-3 bg-white text-black">
          Codatta {data.version}
        </div>
        <div className="text-white">{data.time}</div>
      </div>
      <h3 className="font-bold text-2xl mt-6">{data.title}</h3>
      <p className="text-base leading-7 tracking-wide text-white/40 mt-3">
        {data.des}
      </p>
      <ul className="text-white/40 mt-[56px] text-base tracking-wide list-inside">
        {data.steps.map((item) => (
          <li
            key={item}
            className="pl-8 bg-left-top bg-no-repeat mt-8 first-of-type:mt-0"
            style={{
              backgroundImage: `url(${checkCircleIcon})`,
              backgroundSize: '20px 20px',
              backgroundPositionY: '2px',
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
