import { type LucideIcon } from 'lucide-react'
import styled from 'styled-components'
import RunNum from './RunNum'
import './CardHeader.scss'

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
      <div className="flex items-center">
        <div
          className="w-36px h-36px flex items-center justify-center mr-6px bg-no-repeat bg-contain bg-center card-bg"
        >
          <Icon size={18} />
        </div>
        <div>
          <div className="text-11px text-#40F6E1ED/[0.93]">{label}</div>
          <div className="text-base">{title}</div>
        </div>
      </div>
      <Gradient className="text-5xl mt-12px">
        <RunNum num={num} />
      </Gradient>
    </>
  ) : (
    <>
      <div className="flex">
        <div className="flex items-center justify-center pl-6px pr-12px h-18px rounded-12px bg-#fff bg-opacity-10">
          <Icon color="rgba(64, 246, 225, 0.93)" size={12} className="mr-6px" />
          <div className="text-11px text-#40F6E1ED/[0.93]">{label}</div>
        </div>
      </div>
      <div className="text-base indent-6px mt-6px">{title}</div>
      <Gradient className="text-4xl mt-12px indent-6px">
        <RunNum num={num} />
      </Gradient>
    </>
  )
}

export default CardHeader
