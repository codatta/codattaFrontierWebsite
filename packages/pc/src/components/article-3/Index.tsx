import img from '@/assets/images/article-3/0.svg'
import img1 from '@/assets/images/article-3/1.svg'
import img2 from '@/assets/images/article-3/2.svg'
import img3 from '@/assets/images/article-3/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import useInViewWithAnimate from '@/hooks/useInViewWithAnimate'
import StatisticalTable from '../effects/StatisticalTable'

import EffectCard from '../effects/EffectCard'
import AniTitle from '../effects/AniTitle'
import AniImage from '../effects/AniImage'
import AniGuideLine from '../effects/GuideLine'

import { motion } from 'framer-motion'
import AniContent from '../effects/AniContent'

const Head = () => {
  return (
    <div className="flex justify-between">
      <div className="w-500px">
        <AniTitle
          t1="Public Infrastructure"
          t2="Decentralized Intelligence Data Layer for All"
          des={
            <>
              We aim to develop a foundational metadata infrastructure
              characterized by high <span className="text-#fff">coverage</span>,{' '}
              <span className="text-#fff">quality</span>, and{' '}
              <span className="text-#fff">diversity</span>, empowering builders
              to focus on crafting data-driven AI applications.
            </>
          }
          color="cyan"
        ></AniTitle>
      </div>
      <EffectCard color="#33B3AE">
        <AniImage src={img} className="w-490px" />
      </EffectCard>
    </div>
  )
}

const Section1 = () => {
  return (
    <div className="flex">
      <EffectCard color="#33B3AE">
        <AniImage src={img1} className="w-376px" />
      </EffectCard>
      <AniContent className='ml-70px pt-10 pr-12 flex-1'>
        <h3 className='text-white text-xl mb-4'>Permissionless</h3>
        <p className='text-lg'>
          <span className="text-#fff">Web3 users</span> and{' '}
          <span className="text-#fff">businesses of all sizes</span> can
          contribute label data carrying no privacy. Rewards are granted based
          on contribution significance and in exchange of access to the entire
          metadata space.
        </p>
      </AniContent>
    </div>
  )
}

const Section2 = () => {
  return (
    <div className="flex justify-around items-center">
      <AniContent className='pt-0 pr-12 flex-1'>
        <h3 className='text-white text-xl mb-4'>Ubiquitous Access</h3>
        <p className='text-lg'>
          <span className="text-#fff">Web3 users</span> and{' '}
          <span className="text-#fff">We offer both on-chain and off-chain access, as well as batch or
            single-item-query options via fully decentralized infrastructure in
            the long run.</span>
        </p>
      </AniContent>
      <EffectCard color="#33B3AE">
        <AniImage src={img2} className="w-448px" />
      </EffectCard>
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="mt-40px flex justify-between">
      <EffectCard color="#33B3AE">
        <AniImage src={img3} className="w-620px" />
      </EffectCard>
      <AniContent className="mt-6 ml-18">
        <h3 className="text-white text-xl mb-4">Open Source</h3>
        <p className="text-lg">
          <span className="text-#fff">Web3 users</span> and{' '}
          <span className="text-#fff">
            our protocol and software pipeline have been made entirely
            open-sourced in order to foster further community-driven development
            and step up the trust-less game.
          </span>
        </p>
      </AniContent>
    </div>
  )
}

const StatisticalTableWrapper = () => {
  const { ref, progress } = useInViewWithAnimate()
  return (
    <div ref={ref}>
      <StatisticalTable
        label="Coverage"
        list={[
          {
            t1: 'Labeled Addresses',
            t2: `>${Math.round(progress * 530)}`,
            t3: 'Million',
          },
          {
            t1: 'Supported Networks',
            t2: `${Math.round(progress * 35)}`,
            t3: 'Blockchains',
          },
        ]}
      />
    </div>
  )
}

const Article = () => {
  return (
    <motion.div className="relative text-xl max-w-1240px m-auto box-border pl-17 pr-5 pt-2.5 pb-40">
      <AniGuideLine containerClassName='absolute left-5 h-full top-0' lineClassName="color-3" icon={tracingIcon} />

      <div>
        <Head />
        <Section1 />
        <Section2 />
        <Section3 />
        <StatisticalTableWrapper />
        <div className="mt-100px"></div>
      </div>
    </motion.div>
  )
}

export default Article
