import img1 from '@/assets/images/article-5/1.svg'
import img2 from '@/assets/images/article-5/2.svg'
import img3 from '@/assets/images/article-5/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import StatisticalTable from '../effects/StatisticalTable'

import { motion } from 'framer-motion'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import AniImage from '../effects/AniImage'
import GuideLine from '../effects/GuideLine'

const sections = [
  {
    title: 'No PII Allowed',
    content:
      'Our system is meticulously designed to omit any collection of personal information.',
    img: img1,
  },
  {
    title: 'Anonymous Participation',
    content:
      'Contributors can utilize a web3-native method to create an account, thereby allowing them to remain anonymous and avoid disclosing personal information.',
    img: img2,
  },
  {
    title: 'Credential extracts',
    content:
      'Verifiable credentials (such as KYC or diplomas) constitute a treasure trove of high-value data. Extracted information from these credentials (such as gender or age group) provides anonymous but valuable demographic data that helps to empower the Web3 economy in numerous ways, including on-chain advertising.',
    img: img3,
  },
]

const Article = () => {
  return (
    <motion.div className="relative text-xl flex">
      <GuideLine
        icon={tracingIcon}
        className="h-1330px color-5"
        height="1330px"
      />

      <div className="main">
        <AniTitle
          t1="Privacy-preservation"
          t2="PII-Free Privacy"
          des={
            <>
              Our conviction is firm that personal privacy is a fundamental
              human right. We strive to strike a balance between{' '}
              <span className="text-#FFFFFFDB">transparency</span>
              and <span className="text-#FFFFFFDB">privacy</span>, optimizing
              the massive value that can be unlocked by marrying on-chain and
              off-chain data, while ensuring personal privacy is uncompromised.
            </>
          }
          color="#3857F8"
        ></AniTitle>
        <div className="mt-8px">
          {sections.map((item) => (
            <div className="mt-25px" key={item.title}>
              <AniContent t={item.title} des={item.content} />
              <AniImage src={item.img} className="w-297px mt-16px" />
            </div>
          ))}
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
