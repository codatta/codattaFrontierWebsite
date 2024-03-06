import microImg from '../assets/images/micoroscope.svg'
import tracingIcon from '../assets/images/tracing-icon-0.svg'

import Signup from './Signup'
import styled from 'styled-components'
// import { SparklesCore } from './aceternity-ui/Sparkles'
import {BackgroundBeams} from './aceternity-ui/BgBeam'

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
      <Line1 className="w-4px h-310px" />
      <img src={tracingIcon} className="w-24px h-24px" />
      <Line2 className="w-4px h-234px" />
    </div>
  )
}

const Part = () => {
  return (
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
          <img src={microImg} className="h-94px" />
        </a>
        <div className="w-full absolute inset-0 top-0 left-0 pointer-events-none">
          <BackgroundBeams />
        </div>
      </div>
    </div>
  )
}

export default Part
