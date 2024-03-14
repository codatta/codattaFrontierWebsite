import img2 from '@/assets/images/article-4/2.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import StatisticalTable from '../effects/StatisticalTable'
import Chart from './Chart'
import Card from './Card'

import { motion } from 'framer-motion'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import AniImage from '../effects/AniImage'
import GuideLine from '../effects/GuideLine'

const cards = [
  {
    t1: 'Stage  1 :Validation',
    t2: 'AI-powered',
    des: 'Conditional accessibility with quality warning',
    num1: 5,
    num2: 5,
    bar: 0.05,
  },
  {
    t1: 'Stage 2: Validation',
    t2: 'AI+ Human Intelligence',
    des: 'Accessibility with quality warning',
    num1: 20,
    num2: 15,
    bar: 0.2,
  },
  {
    t1: 'Stage 3: Validation',
    t2: 'Public Exposure',
    des: 'Accessibility with trust',
    num1: 100,
    num2: 80,
    bar: 1,
  },
  {
    t1: 'Stage 4: Lifetime Community Correction',
    t2: '',
    des: 'Continuous Improvement',
    des2: 'Reputation',
    bar: 1,
  },
]

const Article = () => {
  return (
    <motion.div className="relative text-xl flex">
      <GuideLine icon={tracingIcon} className="h-2180px color-4" />
      <div className="main">
        <AniTitle
          t1="Trustworthy"
          t2="Community-Driven High-Quality"
          color="#F55AB7"
        ></AniTitle>
        <Chart />
        <AniContent
          className="mt-32px"
          t="Transparency"
          des="We clearly communicate the data derived from ground-truth,
              heuristic methods, machine learning, and external sources to
              convey the inherent confidence in the data."
        />
        <AniImage src={img2} className="w-287px mt-32px" />
        <AniContent className="mt-32px" t="Multi-staged validation" des="" />

        {cards.map((card) => (
          <Card
            key={card.t1}
            t1={card.t1}
            t2={card.t2}
            des={card.des}
            des2={card.des2}
            num1={card.num1}
            num2={card.num2}
            bar={card.bar}
          />
        ))}
        <StatisticalTable
          className="mt-86px"
          label="Quality"
          list={[
            {
              t1: 'Ground Truth',
              t2: ['5'],
              t3: '%',
            },
            {
              t1: 'Inference (Heuristics + AI)',
              t2: ['43'],
              t3: '%',
            },
            {
              t1: 'External',
              t2: ['52'],
              t3: '%',
            },
          ]}
        />
      </div>
    </motion.div>
  )
}

export default Article
