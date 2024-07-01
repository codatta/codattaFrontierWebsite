import img1 from '@/assets/images/article-2/1.svg'
import img2 from '@/assets/images/article-2/2.svg'
import img3 from '@/assets/images/article-2/3.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import EffectCard from '../effects/EffectCard'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import AniGuideLine from '../effects/GuideLine'
import { motion } from 'framer-motion'

const Article = () => {
  return (
    <motion.div className="relative text-xl max-w-1240px m-auto box-border pl-17 pr-5 pt-2.5 pb-40">
      <AniGuideLine containerClassName='absolute left-5 h-full top-0' lineClassName="color-2" icon={tracingIcon} />
      <div>
        <AniTitle
          t1="Usage Examples"
          t2="Countless data and AI applications for blockchain industry"
          color="green"
        ></AniTitle>
        <EffectCard className="mt-32px">
          <div className="w-full grid grid-cols-2 gap-8 border-1 border-white bg-gradient-to-b from-#ffffff02 to-#ffffff06 rounded-4">
            <img src={img1} className='w-full' />
            <AniContent className='flex flex-col justify-center px-16'>
              <h2 className='text-2xl text-white mb-4'>For Compliance, Risk Management, Trend Analysis and More.</h2>
              <p className='text-16px text-#ffffff7C leading-6'>Decode anonymized addresses with semantics-enabling metadata to
                distill complex transactions into actionable insights for many
                mission-critical analytics use-cases.</p>
            </AniContent>
          </div>
        </EffectCard>
        {/* Section 2 */}
        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* color="#9B3FC6" */}
          <EffectCard>
            <div className="h-200px grid grid-cols-3 bg-gradient-to-b from-#ffffff02 to-#ffffff06 rounded-4">
              <div className='p-2'>
                <img src={img2} className='w-full' />
              </div>
              <AniContent className='flex flex-col justify-start pt-7 col-span-2 px-4'>
                <h2 className='text-xl text-white mb-4'>For On-Chain Profile</h2>
                <p className='text-16px text-#ffffff7C leading-6'>Transform on-chain activities and credential metadata into a
                  portable on-chain profile, empowering users to unlock monetary
                  value with complete control.</p>
              </AniContent>
            </div>
          </EffectCard>
          <EffectCard>
            <div className="h-200px grid grid-cols-3 bg-gradient-to-b from-#ffffff02 to-#ffffff06 rounded-4">
              <div className='p-2'>
                <img src={img3} className='w-full' />
              </div>
              <AniContent className='flex flex-col justify-start pt-7 col-span-2 px-4'>
                <h2 className='text-xl text-white mb-4'>For Global Reputation Score</h2>
                <p className='text-16px text-#ffffff7C leading-6'>Provide the data foundation for building a global FICO score
                  via privacy-preserving technologies (e.g., zkML)</p>
              </AniContent>
            </div>
          </EffectCard>
        </div>
      </div >
    </motion.div >
  )
}

export default Article
