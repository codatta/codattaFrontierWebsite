import img1 from '@/assets/images/article-5/1.svg'
import img2 from '@/assets/images/article-5/2.svg'
import img3 from '@/assets/images/article-5/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import StatisticalTable from '../effects/StatisticalTable'
import useScrollWithProgress from '../../hooks/useScrollWithProgress'

import styled from 'styled-components'
import { motion } from 'framer-motion'

const Line = styled(motion.div)`
  background: linear-gradient(
    to bottom,
    rgba(248, 56, 171, 1),
    rgba(248, 56, 171, 1) 80%,
    rgba(56, 87, 248, 1)
  );
`

const GuideLine = ({ progress }: { progress: any }) => {
  return (
    <motion.div className="flex flex-col justify-between items-center guide-line">
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line
        className="w-4px h-1780px"
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
    <motion.div className="relative text-xl flex" ref={ref}>
      <GuideLine progress={progress} />
      <div className="main">
        <div className="title-1 mt-12px">Privacy-preservation</div>
        <div className="title-2 color-#3857F8">PII-Free Privacy</div>
        <div>
          Our conviction is firm that personal privacy is a fundamental human
          right. We strive to strike a balance between transparency and privacy,
          optimizing the massive value that can be unlocked by marrying on-chain
          and off-chain data, while ensuring personal privacy is uncompromised.
        </div>
        <div className="mt-32px flex justify-between">
          <img src={img1} className="w-635px h-300px mr-55px" />
          <div>
            <div className="title-1">No PII Allowed</div>
            <div>
              Our system is meticulously designed to omit any collection of
              personal information.
            </div>
          </div>
        </div>
        <div className="mt-64px flex justify-between">
          <div>
            <div className="title-1">Anonymous Participation</div>
            <div>
              Contributors can utilize a web3-native method to create an
              account, thereby allowing them to remain anonymous and avoid
              disclosing personal information.
            </div>
          </div>
          <img src={img2} className="w-635px h-300px ml-90px" />
        </div>
        <div className="mt-64px flex justify-between">
          <img src={img3} className="w-635px h-300px ml-52px" />
          <div>
            <div className="title-1">Credential extracts</div>
            <div>
              Verifiable credentials (such as KYC or diplomas) constitute a
              treasure trove of high-value data. Extracted information from
              these credentials (such as gender or age group) provides anonymous
              but valuable demographic data that helps to empower the Web3
              economy in numerous ways, including on-chain advertising.
            </div>
          </div>
        </div>
        <StatisticalTable
          label="Diversity"
          list={[{ t1: 'Gini-Coefficient: 0.92' }]}
        />
      </div>
    </motion.div>
  )
}

export default Article
