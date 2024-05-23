import microImg from '@/assets/images/article-1/micro.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'

import styled from 'styled-components'

import Signup from './Signup'
import Bg from './Bg'
import Title from './Title'

import Head from '../Head'

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
    <div className="flex flex-col justify-between items-center guide-line ml-14px mr-7px">
      <Line1 className="w-4px h-220px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-172px" />
    </div>
  )
}

const Article = () => {
  return (
    <div className="relative">
      <Head className="px-24px" />
      <Bg />
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
