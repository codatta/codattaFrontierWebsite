import img1 from '@/assets/images/article-2/1.svg'
import img2 from '@/assets/images/article-2/2.svg'
import img3 from '@/assets/images/article-2/3.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import GuideLine from '../effects/GuideLine'

import { motion } from 'framer-motion'

import AniImage from '../effects/AniImage'

const Article = () => {
  return (
    <motion.div className="h-1084px relative text-xl flex">
      <GuideLine
        icon={tracingIcon}
        className="h-1050px color-2 -mt-12px"
        height="1050px"
      />
      <div className="main ">
        <AniTitle
          t1="Usage Examples"
          t2="Countless data and AI applications for blockchain industry"
          color="green"
        ></AniTitle>
        <div className="card mt-24px card-border-1">
          <AniImage src={img1} className="w-212px m-auto block" />

          <AniContent
            t="For Compliance, Risk Management, Trend Analysis and More."
            des="Decode anonymized addresses with semantics-enabling metadata to
                distill complex transactions into actionable insights for many
                mission-critical analytics use-cases."
            className="flex-1 mt-20px"
          />
        </div>
        <div className="card mt-16px card-border-1 flex">
          <AniContent
            t={<span className="whitespace-nowrap">For On-Chain Profile</span>}
            des="Transform on-chain activities and credential metadata into a
                  portable on-chain profile, empowering users to unlock monetary
                  value with complete control."
            className="flex-1"
          />
          <div className="flex justify-end items-end">
            <AniImage src={img2} className="w-93px" />
          </div>
        </div>
        <div className="card mt-16px card-border-1 flex">
          <AniContent
            t={
              <span className="whitespace-nowrap">
                For Global Reputation Score
              </span>
            }
            des="Provide the data foundation for building a global FICO score
                  via privacy-preserving technologies (e.g., zkML)"
            className="flex-1"
          />
          <div className="flex justify-end items-end">
            <AniImage src={img3} className="w-93px" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Article
