import img from '@/assets/images/article-3/0.svg'
import img1 from '@/assets/images/article-3/1.svg'
import img2 from '@/assets/images/article-3/2.png'
import img3 from '@/assets/images/article-3/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-2.svg'

import useScrollWithProgress from '@/hooks/useScrollWithProgress'
import StatisticalTable from '../effects/StatisticalTable'

import EffectCard from '../effects/EffectCard'
import AniTitle from '../effects/AniTitle'
import AniImage from '../effects/AniImage'

import styled from 'styled-components'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import AniContent from '../effects/AniContent'

const Head = () => {
  return (
    <div className="flex justify-between text-2xl">
      <div className="w-440px">
        <AniTitle
          t1="Public Infrastructure"
          t2="Decentralized Intelligence Data Layer for All"
          des="We aim to develop a foundational metadata infrastructure characterized
          by high coverage, quality, and diversity, empowering builders to focus
          on crafting data-driven AI applications."
          color="cyan"
        ></AniTitle>
      </div>
      <EffectCard color="#33B3AE">
        <AniImage src={img} className="w-700px" />
      </EffectCard>
    </div>
  )
}

const Section1 = () => {
  return (
    <div className="mt--140px flex">
      <EffectCard color="#33B3AE">
        <AniImage src={img1} className="w-396px" />
      </EffectCard>
      <AniContent
        className="mt-208px ml-70px w-630px"
        t="Permissionless"
        des="Web3 users and businesses of all sizes can contribute label data
          carrying no privacy. Rewards are granted based on contribution
          significance and in exchange of access to the entire metadata space."
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
        <AniImage src={img2} className="w-400px" />
      </EffectCard>
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="mt-40px flex justify-between">
      <EffectCard color="#33B3AE">
        <AniImage src={img3} className="w-600px" />
      </EffectCard>
      <AniContent
        className="w-500px mt-23px"
        t="Open Source"
        des="  Our protocol and software pipeline have been made entirely
          open-sourced in order to foster further community-driven development
          and step up the trust-less game."
      />
    </div>
  )
}

const Line = styled(motion.div)`
  background: linear-gradient(to bottom, #33b3ae, #33b3ae 38%, #f838ab);
`

const Article = () => {
  const { ref, progress } = useScrollWithProgress([0, 1], {
    stiffness: 300,
    damping: 80,
  })

  useEffect(() => {
    console.log('progress: ', progress)
  }, [progress])

  return (
    <motion.div className="h-2532px relative mt-12px flex" ref={ref}>
      {/* Guide line */}
      <motion.div className="flex flex-col justify-between items-center guide-line relative">
        <img src={tracingIcon} className="w-48px h-48px" />
        <Line
          className="w-4px h-2490px"
          style={{ scaleY: progress, transformOrigin: 'top left' }}
        />
      </motion.div>
      <div className="main">
        <Head />
        <Section1 />
        <Section2 />
        <Section3 />
        <StatisticalTable
          label="Coverage"
          list={[
            { t1: 'Labeled Addresses', t2: '>530', t3: 'Millions' },
            {
              t1: 'Supported Networks',
              t2: '35',
              t3: 'Blockchains',
            },
          ]}
        />
        <div className="mt-100px"></div>
      </div>
    </motion.div>
  )
}

export default Article
