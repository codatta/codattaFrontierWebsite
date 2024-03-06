import img1 from '../assets/images/usage-1.svg'
import img2 from '../assets/images/usage-2.svg'
import img3 from '../assets/images/usage-3.svg'
import tracingIcon from '../assets/images/tracing-icon-2.svg'
import EffectCard from './effects/EffectCard'

import styled from 'styled-components'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useInView,
} from 'framer-motion'
import { useRef, useEffect } from 'react'

const Section1 = () => {
  return (
    <EffectCard className="mt-32px">
      <div className="card w-full h-490px flex justify-evenly content-center items-center bg-blur">
        <img src={img1} className="h-full hover:opacity-75" />
        <div className="w-362px">
          <div className="title-1">Compliance & Risk Management</div>
          <div>
            Annotated data equips us to delve deeper into the complexities of
            account and transaction risk profiles, facilitating meticulous
            evaluation and analysis. This comprehensive approach fortifies the
            integrity and security within the Web3 community, fostering a
            trustworthy environment for decentralized transactions and
            interactions.
          </div>
        </div>
      </div>
    </EffectCard>
  )
}

const Card1 = styled.div`
  background: url(${img2}) no-repeat right center;
  background-size: contain;
`
const Card2 = styled.div`
  background: url(${img3}) no-repeat right center;
  background-size: contain;
`

const Line = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(0, 170, 81, 1),
    rgba(40, 177, 154, 1) 77%,
    rgba(51, 179, 174, 1)
  );
`

const Section2 = () => {
  return (
    <div className="mt-58px flex justify-between">
      {/* color="#9B3FC6" */}
      <EffectCard>
        <Card1 className="card small-card w-584px h-316px">
          <div className="title-1">
            User-controlled
            <br />
            On-chain Profile
          </div>
          <div className="w-290px mt-16px">
            We facilitate nuanced insights into user behavior and transaction
            history by integrating diverse data points within ecosystems.
          </div>
        </Card1>
      </EffectCard>
      <EffectCard>
        <Card2 className="card small-card w-584px h-316px">
          <div className="title-1">Reputation</div>
          <div className="w-344px mt-16px">
            Users shape their reputation through product interactions, with
            potential extensions across diverse use cases, amplifying impact
            within the community.
          </div>
        </Card2>
      </EffectCard>
    </div>
  )
}

const GuideLine = () => {
  return (
    <div className="flex flex-col justify-between items-center guide-line mt-6px">
      <img src={tracingIcon} className="w-24px h-24px" />
      {/* <motion.div style={{ scaleY: scrollYProgress }}> */}
      <Line className="w-4px h-1050px" />
      {/* </motion.div> */}
    </div>
  )
}

const Part = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const isInView = useInView(ref)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    console.log('Page scroll: ', latest)
  })

  useEffect(() => {
    console.log('is in view', isInView)
  }, [isInView])

  return (
    <motion.div className="h-1084px relative text-xl flex" ref={ref}>
      <GuideLine />
      <div className="main">
        <div className="title-1 mt-12px">Usage Examples</div>
        <div className="title-2 color-green">
          Countless data and AI applications for blockchain industry
        </div>
        <Section1 />
        <Section2 />
      </div>
    </motion.div>
  )
}

export default Part

