import microImg from '@/assets/images/article-1/micro.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'
import styled from 'styled-components'
import Signup from './Signup'
import Bg from './Bg'
import Title from './Title'

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
    <div className="relative overflow-hidden">
      <div className="relative flex mt-94px overflow-hidden">
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
        </div>
      </div>
      <Bg />
    </div>
  )
}

export default Article
