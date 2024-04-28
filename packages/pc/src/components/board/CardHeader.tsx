import { type LucideIcon } from 'lucide-react'
import styled from 'styled-components'
import colorBorder from '@/assets/images/board/color-border.svg'
import RunNum from './RunNum'

const Gradient = styled.div`
  background: linear-gradient(
    90deg,
    #ffffff 0%,
    rgba(138, 249, 249, 0.9) 15%,
    #8af9f9 100%
  );
  background-clip: text;
  text-fill-color: transparent;
  -webkit-text-fill-color: transparent;
`

const CardHeader = ({
  isBigIcon,
  Icon,
  label = 'Total',
  title,
  num = 0,
}: {
  isBigIcon?: boolean
  Icon: LucideIcon
  label?: string
  title: string
  num: number
}) => {
  return isBigIcon ? (
    <>
      <div className="flex">
        <div
          className="w-48px h-48px flex items-center justify-center bg-no-repeat bg-center bg-contain mr-8px"
          style={{ backgroundImage: `url(${colorBorder})` }}
        >
          <Icon size={22} />
        </div>
        <div>
          <div className="text-sm text-#40F6E1ED/[0.93]">{label}</div>
          <div className="text-xl">{title}</div>
        </div>
      </div>
      <Gradient className="text-5xl mt-16px">
        <RunNum num={num} />
      </Gradient>
    </>
  ) : (
    <>
      <div
        className={`flex items-center justify-center w-80px h-24px rounded-16px ${/points/i.test(label) ? 'bg-#0E0E21 bg-opacity-45' : 'bg-#fff bg-opacity-10'}`}
      >
        <Icon color="rgba(64, 246, 225, 0.93)" size={12} className="mr-8px" />
        <div className="text-sm text-#40F6E1ED/[0.93]">{label}</div>
      </div>
      <div className="text-xl indent-8px mt-8px">{title}</div>
      <Gradient className="text-5xl mt-16px indent-8px ">
        <RunNum num={num} />
      </Gradient>
    </>
  )
}

export default CardHeader
