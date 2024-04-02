import img2 from '@/assets/images/article-2/2.png'
import img3 from '@/assets/images/article-2/3.png'
import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import GuideLine from '../effects/GuideLine'
import Chart from './Chart'

import { motion } from 'framer-motion'

import AniImage from '../effects/AniImage'

const Article = () => {
  return (
    <motion.div className="h-1084px relative text-xl flex">
      <GuideLine
        icon={tracingIcon}
        className="h-1050px color-2"
        height="1050px"
      />
      <div className="main ">
        <AniTitle
          t1="Usage Examples"
          t2="Countless data and AI applications for blockchain industry"
          color="green"
        ></AniTitle>
        <div className="card mt-24px card-border-1">
          <Chart />
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
