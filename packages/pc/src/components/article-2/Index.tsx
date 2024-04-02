import img2 from '@/assets/images/article-2/2.png'
import img3 from '@/assets/images/article-2/3.png'
import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import EffectCard from '../effects/EffectCard'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import AniGuideLine from '../effects/GuideLine'
import Chart from './Chart'

import { motion } from 'framer-motion'

import AniImage from '../effects/AniImage'

const Article = () => {
  return (
    <motion.div className="h-1084px relative text-xl flex">
      <AniGuideLine
        className="h-1084px color-2"
        height="1084px"
        icon={tracingIcon}
      />
      <div className="main">
        <AniTitle
          t1="Usage Examples"
          t2="Countless data and AI applications for blockchain industry"
          color="green"
        ></AniTitle>
        <EffectCard className="mt-32px">
          <div className="w-full h-490px flex justify-evenly content-center items-center bg-blur">
            {/* <img src={img1} className="h-full hover:opacity-75" /> */}
            <Chart />
            <div className="w-362px">
              <AniContent
                t="For Compliance, Risk Management, Trend Analysis and More."
                des="Decode anonymized addresses with semantics-enabling metadata to
                distill complex transactions into actionable insights for many
                mission-critical analytics use-cases."
              />
            </div>
          </div>
        </EffectCard>
        {/* Section 2 */}
        <div className="mt-58px flex justify-between">
          {/* color="#9B3FC6" */}
          <EffectCard>
            <div className="card small-card w-584px h-316px flex">
              <div className="flex-1">
                <AniContent
                  t="For On-Chain Profile"
                  des="Transform on-chain activities and credential metadata into a
                  portable on-chain profile, empowering users to unlock monetary
                  value with complete control."
                  className="w-290px"
                />
              </div>
              <AniImage src={img2} className="w-700px ml--50px" />
            </div>
          </EffectCard>
          <EffectCard>
            <div className="card small-card w-584px h-316px flex">
              <div className="flex-1">
                <AniContent
                  t="For Global Reputation Socre"
                  des="Provide the data foundation for building a global FICO score
                  via privacy-preserving technologies (e.g., zkML)"
                  className="w-344px"
                />
              </div>
              <AniImage src={img3} className="w-700px ml--50px" />
            </div>
          </EffectCard>
        </div>
      </div>
    </motion.div>
  )
}

export default Article
