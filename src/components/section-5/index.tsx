import { cn } from '@udecode/cn'

import checkCircleIcon from '@/assets/check-circle.svg'

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
  return (
    <div className="mt-[80px]  ">
      <Card />
      <Card className="mt-[160px]" />
    </div>
  )
}

function Card({
  version = '1.0',
  time = '2024 Q1',
  title = 'Crypto data Annotation',
  des = 'Pioneering blockchain data annotation with comprehensive account, user, and transaction tagging infrastructure.',
  steps = [
    'Crypto account labeling',
    'Transaction pattern identification',
    'User behavior tagging',
    'Initial data marketplace prototype',
  ],
  className,
}: {
  version?: string
  time?: string
  title?: string
  des?: string
  className?: string
  steps?: string[]
}) {
  return (
    <div className={cn('', className)}>
      <div className="flex justify-between">
        <div className="rounded-full text-base leading-[34px] px-3 bg-white text-black">
          Codatta {version}
        </div>
        <div className="text-white">{time}</div>
      </div>
      <h3 className="font-bold text-2xl leading-6 mt-6">{title}</h3>
      <p className="text-base leading-7 tracking-wide text-white/40">{des}</p>
      <ul
        className="text-white/40 mt-[56px] text-base tracking-wide list-inside"
        style={
          {
            //   listStyleImage: `url(${checkCircleIcon})`,
          }
        }
      >
        {steps.map((item) => (
          <li
            key={item}
            className="pl-8 bg-left-top bg-no-repeat"
            style={{
              backgroundImage: `url(${checkCircleIcon})`,
              backgroundSize: '20px 20px',
              backgroundPositionY: '2px',
            }}
          >
            {item}
            <br />
            jljklj
          </li>
        ))}
      </ul>
    </div>
  )
}
