import img1 from '@/assets/images/article-5/1.svg'
import img2 from '@/assets/images/article-5/2.svg'
import img3 from '@/assets/images/article-5/3.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import StatisticalTable from '../effects/StatisticalTable'

import { motion } from 'framer-motion'
import AniTitle from '../effects/AniTitle'
import AniGuideLine from '../effects/GuideLine'

const Article = () => {
  return (
    <motion.div className="relative text-xl flex">
      <AniGuideLine
        icon={tracingIcon}
        className="h-1700px color-5"
        height="1700px"
      />
      <div className="main text-lg tracking-tight leading-26px text-#FFFFFF73">
        <AniTitle
          t1="Privacy-preservation"
          t2="PII-Free Privacy"
          des={
            <>
              Our conviction is firm that personal privacy is a fundamental
              human right. We strive to strike a balance between{' '}
              <span className="text-#FFFFFFDB">transparency</span> and{' '}
              <span className="text-#FFFFFFDB">privacy</span>, optimizing the
              massive value that can be unlocked by marrying on-chain and
              off-chain data, while ensuring personal privacy is uncompromised.
            </>
          }
          // des={}
          color="#3857F8"
        ></AniTitle>
        <div className="mt-32px flex justify-between">
          <img src={img1} className="w-635px h-300px mr-50px" />
          <div>
            <div className="title-2">No PII Allowed</div>
            <div>
              Our system is meticulously designed to omit any collection of
              personal information.
            </div>
          </div>
        </div>
        <div className="mt-64px flex justify-between">
          <div>
            <div className="title-2">Anonymous Participation</div>
            <div>
              Contributors can utilize a web3-native method to create an
              account, thereby allowing them to remain anonymous and avoid
              disclosing personal information.
            </div>
          </div>
          <img src={img2} className="w-635px h-300px ml-50px" />
        </div>
        <div className="mt-64px flex justify-between">
          <img src={img3} className="w-635px h-300px mr-50px" />
          <div>
            <div className="title-2">Credential extracts</div>
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
