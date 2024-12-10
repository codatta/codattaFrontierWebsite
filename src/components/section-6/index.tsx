import { cn } from '@udecode/cn'
import DynamicSvg from '../dynamic-svg'


const CARDS = [
  {
    title: '2024/07',
    des: 'Commercialization of Crypto Account Annotation, Empowering CipherOwl ',
  },
  {
    title: '2024/06',
    des: 'Launched Pathology frontier, backed by network of doctors from US,Canada, China',
  },
  {
    title: '2024/03 ',
    des: 'Open Codatta 1.0 to public',
  },
  {
    title: '2024/12',
    des: 'Codatta 2.0',
  },
]

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-[32px] leading-10 text-[#1D1D1D]">
          History
        </h3>
        <div className="w-[112px] flex items-center justify-between">
          <DynamicSvg
            iconName="arrow-right-circle"
            className="w-8 h-8 rotate-180"
          />
          <DynamicSvg iconName="arrow-right-circle" />
        </div>
      </div>
      <div className="overflow-hidden mt-10">
        <div className="flex items-stretch gap-6 flex-nowrap w-max">
          {CARDS.map((card) => (
            <Card data={card} className="w-[240px]" />
          ))}
        </div>
      </div>
    </div>
  )
}

type TCard = {
  title: string
  des: string
}

function Card({ data, className }: { data: TCard; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl p-10 border border-solid border-[#0000001F]',
        className
      )}
    >
      <h4 className="font-bold text-lg">{data.title}</h4>
      <p className="text-base tracking-wide mt-6">{data.des}</p>
    </div>
  )
}
