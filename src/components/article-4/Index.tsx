import img1 from '@/assets/images/article-4/1.svg'
import img2 from '@/assets/images/article-4/2.svg'
import img3 from '@/assets/images/article-4/3.svg'
import img4 from '@/assets/images/article-4/4.svg'
import img5 from '@/assets/images/article-4/5.svg'
import img6 from '@/assets/images/article-4/6.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import EffectCard from '../effects/EffectCard'
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
        <div className="title-1 mt-12px">Trustworthy</div>
        <div className="title-2 color-#F55AB7">
          Community-Driven High-Quality
        </div>
        {/* Section 1 */}
        <EffectCard className="mt-32px">
          <img src={img1} className="w-1200px h-574px" />
        </EffectCard>
        <div className="mt-32px flex justify-between">
          <img src={img2} className="w-705px h-300px mr-68px" />
          <div>
            <div className="title-1">Transparency</div>
            <div>
              We clearly communicate the data derived from ground-truth,
              heuristic methods, machine learning, and external sources to
              convey the inherent confidence in the data
            </div>
          </div>
        </div>
        <div className="mt-48px title-1">Multi-staged validation</div>
        <div className="flex justify-between">
          <img src={img3} className="w-288px h-220px" />
          <img src={img4} className="w-288px h-220px" />
          <img src={img5} className="w-288px h-220px" />
          <img src={img6} className="w-288px h-220px" />
        </div>
        <StatisticalTable
          label="Quality"
          list={[
            { t1: 'Ground Truth', t2: '5', t3: '%' },
            {
              t1: 'Inference (Heuristics + AI)',
              t2: '43',
              t3: '%',
            },
            {
              t1: 'External',
              t2: '52',
              t3: '%',
            },
          ]}
        />
      </div>
    </motion.div>
  )
}

export default Article
