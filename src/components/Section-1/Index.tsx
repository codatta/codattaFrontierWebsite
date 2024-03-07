import microImg from '@/assets/images/section-1/micro.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'

import { Button } from 'antd'
import styled from 'styled-components'

import Signup from './Signup'
import BackgroundBeams from '../effects/BgBeam'

function Head() {
  return (
    <header className="header flex justify-between items-center font-medium mt-14px color-white">
      <div className="pl-32px w-68px text-xs">
        <div className="bold text-center text-base">b18a</div>
        <div className="text-left">{'{'}blockchain:</div>
        <div className="text-right">metadata{'}'}</div>
      </div>
      <Button ghost size="middle" className="mr-126px">
        Sign in
      </Button>
    </header>
  )
}

const Title = () => {
  return (
    <div className="text-left h-224px flex flex-col justify-between">
      <h1 className="font-semibold leading-88px text-80px color-white">
        Let's annotate crypto <br />
        addresses from here
      </h1>
      <p>
        The world's leading AI-powered collaboration protocol for blockchain
        metadata.
      </p>
    </div>
  )
}

const GuideLine = () => {
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

  return (
    <div className="flex flex-col justify-between items-center guide-line">
      <Circle className="w-10px h-10px" />
      <Line1 className="w-4px h-300px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-274px" />
    </div>
  )
}

const Section = () => {
  return (
    <>
      <Head />
      <div className="relative flex mt-94px">
        <GuideLine />
        <div className="main">
          <Title />
          <Signup />
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="mt-67px block"
          >
            <img src={microImg} className="h-124px" />
          </a>
          <div className="w-full absolute inset-0 top-0 left-0 pointer-events-none">
            <BackgroundBeams />
          </div>
        </div>
      </div>
    </>
  )
}

export default Section
