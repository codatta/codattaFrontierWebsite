import { Tag } from 'lucide-react'
import CardHeader from './CardHeader'
import RunNum from './RunNum'

const Card = ({
  totalNum = 0,
  topCates = [],
}: {
  totalNum: number
  topCates: {
    name: string
    num: number
  }[]
}) => {
  const max = topCates[0]?.num ?? 1

  return (
    <div className="rounded-3xl bg-#21ffe4 bg-opacity-6 mt-16px  py-24px px-32px overflow-hidden">
      <CardHeader
        Icon={Tag}
        title="Categories Distribution"
        label="Total"
        num={totalNum}
        isBigIcon={true}
      />
      <ul className="grid grid-cols-12 gap-20px list-none m-0 p-0 mt-30px text-nowrap">
        {topCates.map((item, index) => (
          <>
            <li className="indent-24px font-semibold text-lg col-span-9">
              <div
                className="rounded-8px"
                style={{
                  backgroundColor:
                    index === 0
                      ? 'rgba(23, 190, 207, 0.4)'
                      : 'rgba(23, 190, 207, 0.2)',
                  color: index === 0 ? '#09a4a2' : '#059c93',
                  width: (item.num / max) * 100 + '%',
                }}
              >
                {item.name}
              </div>
            </li>
            <li className="font-light text-sm tracking-tight flex items-center justify-end col-span-3">
              <span className="text-#009E8C text-opacity-93 mr-8px">
                Addresses
              </span>
              <RunNum className="text-#fff text-opacity-65" num={item.num} />
            </li>
          </>
        ))}
      </ul>
    </div>
  )
}

export default Card
