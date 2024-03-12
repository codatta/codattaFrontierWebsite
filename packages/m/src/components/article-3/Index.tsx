import img from '@/assets/images/article-3/0.svg'
import img1 from '@/assets/images/article-3/1.svg'
import img2 from '@/assets/images/article-3/2.png'
import img3 from '@/assets/images/article-3/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-3.svg'

import useScrollWithProgress from '@/hooks/useScrollWithProgress'
import StatisticalTable from '../effects/StatisticalTable'

import AniTitle from '../effects/AniTitle'
import AniImage from '../effects/AniImage'

import styled from 'styled-components'

import { animate, motion, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import AniContent from '../effects/AniContent'

const Head = () => {
  return (
    <>
      <AniTitle
        t1="Public Infrastructure"
        t2="Decentralized Intelligence Data Layer for All"
        des="We aim to develop a foundational metadata infrastructure characterized
          by high coverage, quality, and diversity, empowering builders to focus
          on crafting data-driven AI applications."
        color="cyan"
      ></AniTitle>
      <AniImage src={img} className="w-286px mt-23px" />
    </>
  )
}

const Section1 = () => {
  return (
    <div className="mt-32px">
      <AniContent
        t="Permissionless"
        des="Web3 users and businesses of all sizes can contribute label data
          carrying no privacy. Rewards are granted based on contribution
          significance and in exchange of access to the entire metadata space."
      />
      <AniImage src={img1} className="w-287px mt-32px" />
    </div>
  )
}

const Section2 = () => {
  return (
    <div className="mt-32px">
      <AniContent
        t="Ubiquitous Access"
        des="We offer both on-chain and off-chain access, as well as batch or
          single-item-query options via fully decentralized infrastructure in
          the long run."
      />
      <AniImage src={img2} className="w-287px mt-32px" />
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="mt-32px">
      <AniContent
        t="Open Source"
        des="  Our protocol and software pipeline have been made entirely
          open-sourced in order to foster further community-driven development
          and step up the trust-less game."
      />
      <AniImage src={img3} className="w-287px mt-32px" />
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
  const [runNum, setRunNum] = useState(false)
  const [runNumProgress, setRunNumProgress] = useState(0)

  useEffect(() => {
    console.log('progress: ', progress)
  }, [progress])

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest > 0.6 && !runNum) {
      setRunNum(true)
    } else if (latest <= 0.6 && runNum) {
      setRunNum(false)
    }
  })

  useEffect(() => {
    console.log('num: ', runNum)

    animate(runNumProgress, runNum ? 1 : 0, {
      duration: 2,
      onUpdate: (latest) => setRunNumProgress(latest),
    })
  }, [runNum])

  return (
    <motion.div className="h-2200px relative mt-12px flex" ref={ref}>
      {/* Guide line */}
      <motion.div className="flex flex-col justify-between items-center guide-line relative ml-14px mr-7px">
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
          className="mt-100px"
          label="Coverage"
          list={[
            {
              t1: 'Labeled Addresses',
              t2: `>${Math.round(runNumProgress * 530)}`,
              t3: 'Million',
            },
            {
              t1: 'Supported Networks',
              t2: `${Math.round(runNumProgress * 35)}`,
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
