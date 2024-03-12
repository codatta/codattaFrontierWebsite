import microImg from '@/assets/images/article-1/micro.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'

import { Button } from 'antd'
import styled from 'styled-components'

import Signup from './Signup'
import BackgroundBeams from '../effects/BgBeam'
import Bg from './Bg'
import Title from './Title'

import './Index.scss'

function Head() {
  return (
    <header className="header flex justify-between items-center font-medium pt-12px pl-24px color-white">
      <div className="pl-32px w-109px text-xs logo">
        <div className="bold text-base">b18a</div>
        <div className="text-8px leading-8px">
          {'{'}blockchain:metadata{'}'}
        </div>
      </div>
      <Button ghost size="middle" className="mr-25px">
        Sign in
      </Button>
    </header>
  )
}

const Circle = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`

const Line1 = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(139, 63, 198, 0.01),
    rgba(90, 36, 133, 1)
  );
`

const Line2 = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(108, 41, 160, 1),
    rgba(0, 170, 81, 1)
  );
`
const GuideLine = () => {
  return (
    <div className="flex flex-col justify-between items-center guide-line mr-7px">
      {/* <Circle className="w-10px h-10px" /> */}
      <Line1 className="w-4px h-343px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-172px" />
    </div>
  )
}

const Article = () => {
  return (
    <div className="relative">
      <Head />
      <Bg />
      <div className="w-full h-580px absolute inset-0 top-0 left-0 pointer-events-none">
        <BackgroundBeams />
      </div>
      <div className="flex mt-243px ">
        <GuideLine />
        <div className="main">
          <Title />
          <Signup />
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="mt-40px block"
          >
            <img src={microImg} className="h-94px" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Article
