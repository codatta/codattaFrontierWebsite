// import img1 from '@/assets/images/article-2/1.svg'
import img2 from '@/assets/images/article-2/2.png'
import img3 from '@/assets/images/article-2/3.png'
import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import EffectCard from '../effects/EffectCard'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import Chart from './Chart'

import styled from 'styled-components'
import { motion } from 'framer-motion'

import useScrollWithProgress from '../../hooks/useScrollWithProgress'
import AniImage from '../effects/AniImage'

const Line = styled(motion.div)`
  background: linear-gradient(
    to bottom,
    rgba(0, 170, 81, 1),
    rgba(40, 177, 154, 1) 77%,
    rgba(51, 179, 174, 1)
  );
`

const GuideLine = ({ progress }: { progress: any }) => {
  return (
    <motion.div className="flex flex-col justify-between items-center guide-line mr-7px ml-14px">
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line
        className="w-4px h-1050px"
        style={{ scaleY: progress, transformOrigin: 'top left' }}
      />
    </motion.div>
  )
}

const Article = () => {
  const { ref, progress } = useScrollWithProgress([0, 1], {
    stiffness: 300,
    damping: 80,
  })

  return (
    <motion.div className="h-1084px relative text-xl flex" ref={ref}>
      <GuideLine progress={progress} />
      <div className="main ">
        <AniTitle
          t1="Usage Examples"
          t2="Countless data and AI applications for blockchain industry"
          color="green"
        ></AniTitle>
        <div className="card mt-24px card-border-1">
          <Chart progress={progress} />
          <AniContent
            t="For Compliance, Risk Management, Trend Analysis and More."
            des="Decode anonymized addresses with semantics-enabling metadata to
                distill complex transactions into actionable insights for many
                mission-critical analytics use-cases."
          />
        </div>
        <div className="card mt-16px card-border-1">
          <AniContent
            t="For On-Chain Profile"
            des="Transform on-chain activities and credential metadata into a
                  portable on-chain profile, empowering users to unlock monetary
                  value with complete control."
            className="w-290px"
          />
          <div className="flex justify-end">
            <AniImage src={img2} className="w-129px" />
          </div>
        </div>
        <div className="card mt-16px card-border-1">
          <AniContent
            t="For Global Reputation Socre"
            des="Provide the data foundation for building a global FICO score
                  via privacy-preserving technologies (e.g., zkML)"
            className="w-290px"
          />
          <div className="flex justify-end">
            <AniImage src={img3} className="w-129px" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Article
