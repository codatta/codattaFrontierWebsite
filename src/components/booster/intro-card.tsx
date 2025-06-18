import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pagination } from './pagination'
import { Button } from './button'

import { type DataITemIntro } from './types'
import { useBoosterStore } from '@/stores/booster.store'

export function IntroCard({
  introList,
  onComplete,
  completeText = 'Task Completed'
}: {
  introList: DataITemIntro[]
  onComplete: () => void
  completeText?: string
}) {
  const [introIndex, setIntroIndex] = useState(0)
  const intro = useMemo(() => introList[introIndex], [introList, introIndex])
  const total = useMemo(() => introList.length, [introList])
  const { loading } = useBoosterStore()

  const onClickButton = () => {
    if (introIndex < total - 1) {
      setIntroIndex(introIndex + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence initial={true} mode="wait">
        <Card key={introIndex} {...intro} index={introIndex} total={total} />
      </AnimatePresence>
      <Button
        index={introIndex}
        text={introIndex < total - 1 ? 'Continue' : completeText}
        onClick={onClickButton}
        seconds={5}
        loading={loading}
      />
    </div>
  )
}

const cardVariants = {
  hidden: {
    opacity: 0,
    x: '50%',
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  visible: {
    opacity: 1,
    x: '0%',
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    x: '-50%',
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

const itemVariantsTop = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

const itemVariantsFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

function Card({ title, des, banner, index, total }: DataITemIntro & { index: number; total: number }) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      {banner && <motion.img src={banner} alt="" className="mt-4 h-auto w-full" variants={itemVariantsTop} />}
      {title && (
        <motion.h2 className="mt-4 text-center text-2xl font-bold leading-9" variants={itemVariantsFade}>
          {title}
        </motion.h2>
      )}
      <motion.div variants={itemVariantsFade}>
        <Pagination index={index} total={total} />
      </motion.div>
      <motion.div className="mt-4 space-y-2 rounded-xl bg-[#252532] p-4 text-lg" variants={itemVariantsTop}>
        {des?.map((item, index) => {
          if (item.type === 'p') {
            return <p key={'p' + index}>{item.content}</p>
          } else if (item.type === 'ul') {
            return (
              <ul key={'ul' + index}>
                {item.content.map((item, index2) => (
                  <li key={'ul' + index + '-' + index2} className="flex gap-3">
                    <span className="mt-3 block size-1 shrink-0 rounded-full bg-white"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          } else if (item.type === 'h4') {
            return (
              <h4 key={'h4' + index} className="text-lg font-bold">
                {item.content}
              </h4>
            )
          } else if (item.type === 'light') {
            return (
              <p key={'light' + index} className="text-[#BBBBBE]">
                {item.content}
              </p>
            )
          }
        })}
      </motion.div>
    </motion.div>
  )
}
