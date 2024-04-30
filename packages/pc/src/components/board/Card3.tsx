import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import CardHeader from './CardHeader'
import { type TPoints } from '@/stores/dashboard.store'
import defaultAvatarIcon from '../../assets/images/board/default-avatar-1.png'
import bg from '@/assets/images/board/point-bg.svg'
import pointItemBg from '@/assets/images/board/point-rect.svg'
import './Card3.scss'
import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'

const Bg = styled.div`
  background:
    radial-gradient(
        148.57% 148.96% at -30.44% -48.96%,
        rgba(19, 99, 255, 0.16) 0%,
        rgba(6, 71, 77, 0.7) 79.33%,
        rgba(6, 77, 77, 0.13) 100%
      )
      /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
`

const CarouselItem = ({
  icon,
  userName,
  num,
}: {
  icon: string
  userName: string
  num: number
}) => {
  return (
    <motion.li
      className="h-28px mr-8px relative rounded-14px whitespace-nowrap"
      style={{
        backgroundImage: `url(${pointItemBg})`,
      }}
    >
      <div className="relative h-full rounded-14px pl-4px pr-12px flex shrink-0 items-center gap-8px text-sm z-1 bg-#16383d">
        <span
          className="w-19px h-19px rounded-full bg-no-repeat bg-center bg-contain block"
          style={{ backgroundImage: `url(${icon || defaultAvatarIcon})` }}
        ></span>
        <span className="text-#A9FAFA font-light">{userName}</span>
        <span className="text-#40F6E1 text-opacity-90 italic font-semibold">
          +{num}
        </span>
      </div>
      <div className="absolute -left-1px -top-1px -right-1px -bottom-1px bg-red rounded-14px z-0 color-bg"></div>
    </motion.li>
  )
}
const Row = ({ index, points = [] }: { index: number; points: TPoints }) => {
  const ref = useRef<HTMLUListElement>()
  const [width, setWiddth] = useState(370)
  const [count, setCount] = useState(1)

  useEffect(() => {
    const lis = ref.current.getElementsByTagName('li')
    let totalWidth = 0

    for (let i = 0; i < lis.length; i++) {
      totalWidth += lis[i].offsetWidth
    }

    setWiddth(totalWidth)
    setCount(Math.max(totalWidth / ref.current.offsetWidth))
  }, [points, ref])

  return (
    <motion.ul
      className="list-none flex justify-start p-0 m-0 mt-12px relative h-28px"
      initial={{ x: 0 }}
      animate={{
        x: -width,
      }}
      transition={{
        ease: 'linear',
        duration: count * 10 * (1 - index * 0.15),
        repeat: Infinity,
      }}
      ref={ref}
    >
      {points.map((item, index) => (
        <CarouselItem
          icon={item.avatar}
          num={item.totalPoint}
          userName={item.userName}
          key={item.userName + index}
        />
      ))}
    </motion.ul>
  )
}

const Card = ({ num = 0, points = [] }: { num: number; points: TPoints }) => {
  const avCount = Math.max(Math.floor(points.length / 3))
  const count1 = Math.max(avCount - 1, 0)

  return (
    <div
      className="rounded rounded-t-3xl py-24px g-no-repeat bg-center bg-cover relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="px-32px relative z-1">
        <CardHeader Icon={Send} title="Earned Points" num={num} />
      </div>
      <div className="mt-35px overflow-hidden pb-24px">
        <Row index={0} points={points.slice(0, count1)} />
        <Row index={1} points={points.slice(count1, count1 + avCount)} />
        <Row index={2} points={points.slice(count1 + avCount)} />
      </div>
      <Bg className="left-0 top-0 bottom-0 right-0 absolute rounded-3xl" />
    </div>
  )
}

export default Card
