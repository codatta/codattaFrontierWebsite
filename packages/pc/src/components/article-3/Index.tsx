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
    <div className="mt--140px flex">
      <EffectCard color="#33B3AE">
        <AniImage src={img1} className="w-376px" />
      </EffectCard>
      <AniContent
        className="mt-208px ml-70px mr-100 w-630px"
        t="Permissionless"
        des={
          <>
            <span className="text-#fff">Web3 users</span> and{' '}
            <span className="text-#fff">businesses of all sizes</span> can
            contribute label data carrying no privacy. Rewards are granted based
            on contribution significance and in exchange of access to the entire
            metadata space.
          </>
        }
      />
    </div>
  )
}

const Section2 = () => {
  return (
    <div className="mt-100px flex justify-around items-center">
      <AniContent
        className="643px"
        t="Ubiquitous Access"
        des="We offer both on-chain and off-chain access, as well as batch or
          single-item-query options via fully decentralized infrastructure in
          the long run."
      />
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
      <AniContent
        className="w-505px mt-23px"
        t="Open Source"
        des="  Our protocol and software pipeline have been made entirely
          open-sourced in order to foster further community-driven development
          and step up the trust-less game."
      />
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
    <motion.div className="h-2532px relative mt-12px flex">
      <AniGuideLine
        className="h-2490px color-3"
        height="2490px"
        icon={tracingIcon}
      />
      <div className="main">
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
