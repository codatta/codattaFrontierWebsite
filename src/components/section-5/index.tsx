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

type TCard = {
  version: string
  time: string
  title: string
  des: string
  steps: string[]
}

const CARDS: TCard[] = [
  {
    version: '1.0',
    time: '2024 Q1',
    title: 'Crypto data Annotation',
    des: 'Pioneering blockchain data annotation with comprehensive account, user, and transaction tagging infrastructure.',
    steps: [
      'Crypto account labeling',
      'Transaction pattern identification',
      'User behavior tagging',
      'Initial data marketplace prototype',
    ],
  },
  {
    version: '2.0',
    time: '2024 Q3',
    title: 'Vertical Al Marketplace & DeSci Factory',
    des: 'Pioneering blockchain data annotation with comprehensive account, user, and transaction tagging infrastructure.',
    steps: [
      'Crypto account labeling',
      'Transaction pattern identification',
      'User behavior tagging',
      'Initial data marketplace prototype',
    ],
  },
  {
    version: '3.0',
    time: '2025 Q3',
    title: 'Decentralized Data Exchange',
    des: 'Pioneering blockchain data annotation with comprehensive account, user, and transaction tagging infrastructure.',
    steps: [
      'Crypto account labeling',
      'Transaction pattern identification',
      'User behavior tagging',
      'Initial data marketplace prototype',
    ],
  },
]
function Cards() {
  return (
    <div className="mt-[80px] flex gap-10">
      <div className="w-[2px] bg-[#2B2B2B] overflow-hidden">
        <div className="h-[120px] bg-gradient-to-b from-[#2B2B2B] to-[#4190FF]"></div>
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
      <ul
        className="text-white/40 mt-[56px] text-base tracking-wide list-inside"
        style={
          {
            //   listStyleImage: `url(${checkCircleIcon})`,
          }
        }
      >
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
