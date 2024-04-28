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
    <div className="rounded-3xl bg-#8AD4F90A bg-opacity-6 mt-16px  py-24px px-32px overflow-hidden">
      <CardHeader
        Icon={Tag}
        title="Catagories"
        num={totalNum}
        isBigIcon={true}
      />
      <ul className=" list-none m-0 p-0 mt-20px">
        {topCates.map((item, index) => (
          <li className="relative h-21px mb-15px" key={item.name + index}>
            <div
              className="rounded-8px indent-16px font-semibold text-sm"
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
            <div className="font-light text-10px tracking-tight flex items-center justify-end absolute top-0 right-18px h-full">
              <span className="text-#009E8C text-opacity-93 mr-6px">
                Addresses
              </span>
              <RunNum className="text-#fff text-opacity-65" num={item.num} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Card
