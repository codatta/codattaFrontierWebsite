import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import CardHeader from './CardHeader'
import { type TPoints } from '@/stores/dashboard.store'
import defaultAvatarIcon from '../../assets/images/board/default-avatar-1.png'
import bg from '@/assets/images/board/point-bg.svg'
import pointItemBg from '@/assets/images/board/point-rect.svg'
import './Card3.scss'
import styled from 'styled-components'

const Bg = styled.div`
  // background: linear-gradient(
  //   to right,
  //   rgba(0, 0, 0, 0.5) 0%,
  //   rgba(255, 255, 255, 0) 50%,
  //   rgba(0, 0, 0, 0.5) 100%
  // );
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
      className="h-28px w-155px rounded-20px px-4px flex shrink-0 items-center gap-8px bg-no-repeat bg-center bg-contain text-sm box-border mr-8px"
      style={{
        backgroundImage: `url(${pointItemBg})`,
      }}
    >
      <span
        className="w-19px h-19px rounded-full bg-no-repeat bg-center bg-contain block"
        style={{ backgroundImage: `url(${icon || defaultAvatarIcon})` }}
      ></span>
      <span className="text-#A9FAFA font-light">{userName}</span>
      <span className="text-#40F6E1 text-opacity-90 italic font-semibold">
        +{num}
      </span>
    </motion.li>
  )
}
const Row = ({ index, points = [] }: { index: number; points: TPoints }) => {
  const len = points.length

  return (
    <motion.ul
      className="list-none flex justify-start p-0 m-0 mt-12px relative h-28px"
      initial={{ x: 'calc(370)px' }}
      animate={{
        x: `calc(-${(155 + 8) * len}px)`,
      }}
      transition={{
        ease: 'linear',
        duration: len * 3 * (1 - index * 0.15),
        repeat: Infinity,
      }}
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
      className="rounded rounded-t-3xl py-24px h-350px g-no-repeat bg-center bg-cover box-border relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="px-32px relative z-1">
        <CardHeader Icon={Send} title="Total Earned Points" num={num} />
      </div>
      <div className="mt-35px overflow-hidden ">
        <Row index={0} points={points.slice(0, count1)} />
        <Row index={1} points={points.slice(count1, count1 + avCount)} />
        <Row index={2} points={points.slice(count1 + avCount)} />
      </div>
      <Bg className="left-0 top-0 bottom-0 right-0 absolute rounded-3xl" />
    </div>
  )
}

export default Card
