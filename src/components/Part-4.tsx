import img1 from '../assets/images/trust-1.svg'
import img2 from '../assets/images/trust-2.svg'
import img3 from '../assets/images/trust-3.svg'

import tracingIcon from '../assets/images/tracing-icon-3.svg'
import asideLine from '../assets/images/tracing-aside-2.svg'

import EffectCard from './effects/EffectCard'
import StatisticalTable from './effects/StatisticalTable'

import styled from 'styled-components'
import { motion } from 'framer-motion'

import { useEffect } from 'react'

import useScrollWithProgress from '../hooks/useScrollWithProgress'

const Head = () => {
  return (
    <>
      <div className="title-1 mt-12px">Trustworthy</div>
      <div className="title-2 color-#F838AB">Data Trust Algorithm</div>
      <div className="mt-16px">
        Leading blockchain providers operate within a secretive framework with
        no publicly accessible information on their data collection methods, nor
        third-party validation. Because of this obscurity, end-users often
        hesitate to consume the data, as they are unsure about its quality.
      </div>
    </>
  )
}

const Section1 = () => {
  return (
    <>
      <div className="mt-48px flex justify-between">
        <img src={img2} className="w-700px mr-60px" />
        <div>
          <div className="title-1 mt-12px">Transparency</div>
          <div className="pr-23px">
            We clearly communicate the data derived from ground-truth, heuristic
            methods, machine learning, and external sources to convey the
            inherent confidence in the data
          </div>
        </div>
      </div>
      <div className="mt-100px flex justify-between">
        <div className="w-510px">
          <div className="title-2">Multi-staged validation</div>
          <div>
            Each individual contribution undergoes a stringent validation
            process, which involves an AI-powered automated review, followed by
            a peer-review, and continually informed by community feedback.
          </div>
        </div>
        <EffectCard color="#f838ab">
          <img src={img3} className="w-600px" />
        </EffectCard>
      </div>
    </>
  )
}

const SplitLine = styled.div`
  //   height: 105px;
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.1)
  );
`
const Section2 = () => {
  return (
    <div className="flex justify-end mt-120px">
      <EffectCard className="ml-60px w-full" color="#f838ab">
        <div className="card w-1140x h-192px flex-1 box-content flex justify-around p-0 items-center">
          <div>
            <div className="title-1">Ground Truth</div>
            <div className="color-#F838AB bold leading-56px">
              <span className="text-48px">10</span>
              <span>%</span>
            </div>
          </div>
          <div className="flex">
            <SplitLine className="mr-64px" />
            <div>
              <div className="title-1">Inference (Heuristics + AI)</div>
              <div className="color-#F838AB bold leading-56px">
                <span className="text-48px">10</span>
                <span>%</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <SplitLine className="mr-64px" />
            <div>
              <div className="title-1">External</div>
              <div className="color-#F838AB bold leading-56px">
                <span className="text-48px">10</span>
                <span className="">%</span>
              </div>
            </div>
          </div>
        </div>
      </EffectCard>
    </div>
  )
}

const Line = styled(motion.div)`
  background: linear-gradient(to bottom, #f838ab, #3857f8 94%, #3857f8);
`
const GuideLine = ({ progress }: { progress: any }) => {
  return (
    <motion.div className="flex flex-col justify-between items-center guide-line mt-6px relative">
      <img src={tracingIcon} className="w-24px h-24px" />
      <img
        src={asideLine}
        className="w-84px h-364px absolute top-1480px left-21px"
      />
      <Line
        className="w-4px h-1850px"
        style={{ scaleY: progress, transformOrigin: 'top left' }}
      />
    </motion.div>
  )
}

const Part = () => {
  const { ref, progress } = useScrollWithProgress([0, 1], {
    stiffness: 300,
    damping: 80,
  })

  useEffect(() => {
    console.log('progress: ', progress)
  }, [progress])

  return (
    <motion.div className="flex" ref={ref}>
      <GuideLine progress={progress} />
      <div className="main pb-128px">
        <Head />
        <img src={img1} className="w-full mt-32px" />
        <Section1 />
        <Section2 />
        <StatisticalTable />
      </div>
    </motion.div>
  )
}

export default Part
