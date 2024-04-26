import { Send } from 'lucide-react'
import CardHeader from './CardHeader'
import { motion } from 'framer-motion'
// import defaultAvatarIcon from '../../assets/images/board/default-avatar-1.png'
import bg from '@/assets/images/board/point-bg.svg'
import pointItemBg from '@/assets/images/board/point-rect.svg'
import './Card3.scss'

const CarouselItem = ({
  icon,
  userName,
  num,
  index = 0,
}: {
  icon: string
  userName: string
  num: number
  index: number
}) => {
  const containerWidth = 370
  const itemWidth = 155
  const gap = 12
  const duration = 4
  // const delay = (duration * (gap + itemWidth)) / (containerWidth + itemWidth)
  //   index = Math.abs(index)
  //   const scale = scales[index] ?? 0.1
  //   const y = ys[index] ?? 20 + 'px'
  //   const zIndex = index === 0 ? -999 : index
  //   const opacity = index > 6 ? 0 : 1

  return (
    <motion.li
      className="h-28px w-155px rounded-20px px-4px flex shrink-0 items-center gap-8px bg-no-repeat bg-center bg-contain text-sm box-border absolute"
      style={{
        backgroundImage: `url(${pointItemBg})`,
        left: containerWidth + 'px',
        // left: containerWidth + (itemWidth + gap) * (index % 3) + 'px',
      }}
      // animate={{ x: -2 * containerWidth }}
      transition={{ duration: 4, delay: 0.1 * index }}
    >
      <span
        className="w-19px h-19px rounded-full bg-no-repeat bg-center bg-contain block"
        style={{ backgroundImage: `url(${icon})` }}
      ></span>
      <span className="text-#A9FAFA font-light">{userName}</span>
      <span className="text-#40F6E1 text-opacity-90 italic font-semibold">
        +{num}
      </span>
    </motion.li>
  )
}
const Row = ({ index }: { index: number }) => {
  const list = [
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
    {
      userName: 'Saphia',
      avatar:
        'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
      totalPoint: 8,
    },
  ]
  return (
    <ul className="list-none flex justify-start p-0 m-0 mt-12px relative h-28px">
      {list.map((item, index) => (
        <CarouselItem
          icon={item.avatar}
          num={item.totalPoint}
          userName={item.userName}
          index={index}
        />
      ))}
    </ul>
  )
}

const Card = ({ num = 0 }: { num: number }) => {
  return (
    <div
      className="rounded rounded-t-3xl py-24px h-350px g-no-repeat bg-center bg-cover box-border overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="px-32px">
        <CardHeader Icon={Send} title="Total Earned Points" num={num} />
      </div>
      <div className="mt-35px mx-8px overflow-hidden">
        <Row index={0} />
        {/* <Row index={1} />
        <Row index={2} /> */}
      </div>
    </div>
  )
}

export default Card
