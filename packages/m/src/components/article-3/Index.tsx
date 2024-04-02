import img from '@/assets/images/article-3/0.svg'
import img1 from '@/assets/images/article-3/1.svg'
import img2 from '@/assets/images/article-3/2.png'
import img3 from '@/assets/images/article-3/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-3.svg'

import StatisticalTable from '../effects/StatisticalTable'

import AniTitle from '../effects/AniTitle'
import AniImage from '../effects/AniImage'

import { motion } from 'framer-motion'
import AniContent from '../effects/AniContent'
import GuideLine from '../effects/GuideLine'

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

const sections = [
  {
    title: 'Permissionless',
    content:
      'Web3 users and businesses of all sizes can contribute label data carrying no privacy. Rewards are granted based on contribution significance and in exchange of access to the entire metadata space.',
    img: img1,
  },
  {
    title: 'Ubiquitous Access',
    content:
      'We offer both on-chain and off-chain access, as well as batch or single-item-query options via fully decentralized infrastructure in the long run.',
    img: img2,
  },
  {
    title: 'Open Source',
    content:
      'Our protocol and software pipeline have been made entirely open-sourced in order to foster further community-driven development and step up the trust-less game.',
    img: img3,
  },
]

const Article = () => {
  return (
    <motion.div className="h-2200px relative mt-12px flex">
      <GuideLine
        icon={tracingIcon}
        className="h-2490px color-3"
        height="2490px"
      />

      <div className="main">
        <Head />
        {sections.map((item) => (
          <div className="mt-32px" key={item.title}>
            <AniContent t={item.title} des={item.content} />
            <AniImage src={item.img} className="w-287px mt-32px" />
          </div>
        ))}
        <StatisticalTable
          className="mt-100px"
          label="Coverage"
          list={[
            {
              t1: 'Labeled Addresses',
              t2: ['>', '530'],
              t3: 'Million',
            },
            {
              t1: 'Supported Networks',
              t2: ['35'],
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
