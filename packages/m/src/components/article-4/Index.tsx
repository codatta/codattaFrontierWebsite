import img2 from '@/assets/images/article-4/2.svg'

import tracingIcon from '@/assets/images/icons/tracing-icon-4.svg'

import StatisticalTable from '../effects/StatisticalTable'
import Chart from './Chart'
import Card from './Card'

import useScrollWithProgress from '../../hooks/useScrollWithProgress'

import styled from 'styled-components'
import { animate, motion, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import AniTitle from '../effects/AniTitle'
import AniContent from '../effects/AniContent'
import AniImage from '../effects/AniImage'

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
    <motion.div className="flex flex-col justify-between items-center guide-line ml-14px mr-7px">
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line
        className="w-4px h-2180px"
        style={{ scaleY: progress, transformOrigin: 'top left' }}
      />
    </motion.div>
  )
}

const Article = () => {
  const [chartOpen, setChartOpen] = useState(false)

  const { ref, progress } = useScrollWithProgress([0, 1], {
    stiffness: 300,
    damping: 80,
  })

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest > 0.1 && !chartOpen) {
      setChartOpen(true)
    } else if (latest <= 0.1 && chartOpen) {
      setChartOpen(false)
    }

    if (latest > 0.5 && !runNum) {
      setRunNum(true)
    } else if (latest <= 0.5 && runNum) {
      setRunNum(false)
    }
  })

  const [runNum, setRunNum] = useState(false)
  const [runNumProgress, setRunNumProgress] = useState(0)

  useEffect(() => {
    console.log('num: ', runNum)

    animate(runNumProgress, runNum ? 1 : 0, {
      duration: 2,
      onUpdate: (latest) => setRunNumProgress(latest),
    })
  }, [runNum])

  return (
    <motion.div className="relative text-xl flex" ref={ref}>
      <GuideLine progress={progress} />
      <div className="main">
        <AniTitle
          t1="Trustworthy"
          t2="Community-Driven High-Quality"
          color="#F55AB7"
        ></AniTitle>
        <Chart open={chartOpen} />
        <AniContent
          className="mt-32px"
          t="Transparency"
          des="We clearly communicate the data derived from ground-truth,
              heuristic methods, machine learning, and external sources to
              convey the inherent confidence in the data."
        />
        <AniImage src={img2} className="w-287px mt-32px" />
        <AniContent className="mt-32px" t="Multi-staged validation" des="" />

        <Card
          t1="Stage  1 :Validation"
          t2="AI-powered"
          des="Conditional accessibility with quality 
warning"
          num1={5}
          num2={5}
          progress={runNumProgress}
        />
        <Card
          t1="Stage 2: Validation"
          t2="AI+ Human Intelligence"
          des="Accessibility with quality warning"
          num1={20}
          num2={15}
          progress={runNumProgress}
        />
        <Card
          t1="Stage 3: Validation"
          t2="Public Exposure"
          des="Accessibility with trust"
          num1={100}
          num2={80}
          progress={runNumProgress}
        />
        <Card
          t1="Stage 4: Lifetime Community Correction"
          t2=""
          des="Continuous Improvement"
          progress={runNumProgress}
          des2="Reputation"
        />
        <StatisticalTable
          className="mt-86px"
          label="Quality"
          list={[
            {
              t1: 'Ground Truth',
              t2: (runNumProgress * 5).toFixed(0),
              t3: '%',
            },
            {
              t1: 'Inference (Heuristics + AI)',
              t2: (runNumProgress * 43).toFixed(0),
              t3: '%',
            },
            {
              t1: 'External',
              t2: (runNumProgress * 52).toFixed(0),
              t3: '%',
            },
          ]}
        />
      </div>
    </motion.div>
  )
}

export default Article
