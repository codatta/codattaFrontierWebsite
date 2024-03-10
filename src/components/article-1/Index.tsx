import microImg from '@/assets/images/article-1/micro.svg'
import logoIcon from '@/assets/images/icons/logo.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'

import { Button } from 'antd'
import styled from 'styled-components'

import Signup from './Signup'
import BackgroundBeams from '../effects/BgBeam'
import Bg from './Bg'
// import Title from './Title'

const Logo = styled.div`
  background: url(${logoIcon}) left center no-repeat;
  background-size: 24px auto;
`

function Head() {
  return (
    <header className="header flex justify-between items-center font-medium pt-14px color-white">
      <Logo className="pl-48px w-68px text-xs">
        <div className="bold text-base">b18a</div>
        <div className="text-8px">
          {'{'}blockchain:metadata{'}'}
        </div>
      </Logo>
      <Button ghost size="middle" className="mr-126px">
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
    <div className="flex flex-col justify-between items-center guide-line">
      <Circle className="w-10px h-10px" />
      <Line1 className="w-4px h-300px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-274px" />
    </div>
  )
}

const Article = () => {
  return (
    <div className="relative">
      <Head />
      <div className="relative flex mt-94px">
        <GuideLine />
        <div className="main">
          <div className="text-80px leading-88px color-#fff font-semibold">
            Let's annotate crypto
            <br /> addresses from here
          </div>
          <p className="text-2xl mt-16px">
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </p>
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
      {/* <div className="w-300px h-300px">
        <svg width="400" height="180">
          <rect
            x="50"
            y="20"
            width="150"
            height="150"
            style="fill:none; stroke:red; stroke-width:2"
          >
            <animate
              attributeName="x"
              from="50"
              to="200"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div> */}
      <Bg />
    </div>
  )
}

export default Article
