import img2 from '@/assets/images/article-4/2.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import EffectCard from '../effects/EffectCard'
import StatisticalTable from '../effects/StatisticalTable'
import Chart from './Chart'
import Card from './Card2'

import useInViewWithAnimate from '@/hooks/useInViewWithAnimate'

import { motion } from 'framer-motion'
import AniTitle from '../effects/AniTitle'
import AniGuideLine from '../effects/GuideLine'

const StatisticalTableWrapper = () => {
  const { ref, progress } = useInViewWithAnimate()
  return (
    <div ref={ref}>
      <StatisticalTable
        label="Quality"
        list={[
          {
            t1: 'Ground Truth',
            t2: (progress * 5).toFixed(0),
            t3: '%',
          },
          {
            t1: 'Inference (Heuristics + AI)',
            t2: (progress * 43).toFixed(0),
            t3: '%',
          },
          {
            t1: 'External',
            t2: (progress * 52).toFixed(0),
            t3: '%',
          },
        ]}
      />
    </div>
  )
}

const Article = () => {
  return (
    <motion.div className="relative text-xl flex">
      <AniGuideLine
        icon={tracingIcon}
        className="h-1780px color-4"
        height="1780px"
      />
      <div className="main">
        <AniTitle
          t1="Trustworthy"
          t2="Community-Driven High-Quality"
          color="#F55AB7"
        ></AniTitle>
        <EffectCard className="mt-32px">
          <Chart />
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
          <Card
            t1="Stage  1 :Validation"
            t2="AI-powered"
            des="Conditional accessibility with quality 
warning"
            num1={5}
            num2={5}
            bar={0.05}
            // progressType={1}
          />
          <Card
            t1="Stage 2: Validation"
            t2="AI+ Human Intelligence"
            des="Accessibility with quality warning"
            num1={20}
            num2={15}
            bar={0.2}
            // progressType={2}
          />
          <Card
            t1="Stage 3: Validation"
            t2="Public Exposure"
            des="Accessibility with trust"
            num1={100}
            num2={80}
            bar={1}
            // progressType={3}
          />
          <Card
            t1="Stage 4: Lifetime Community Correction"
            t2=""
            des="Continuous Improvement"
            // progressType={3}
            des2="Reputation"
            bar={1}
          />
        </div>
        <StatisticalTableWrapper />
      </div>
    </motion.div>
  )
}

export default Article
