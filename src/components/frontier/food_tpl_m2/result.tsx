import { useEffect, useState } from 'react'
// 1. Import motion from framer-motion
import { motion } from 'framer-motion'

import ApprovedIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg?react'

import { ModelInfo } from './types'

// 2. Define animation variants for the container and its items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2 // Animate children with a 0.2s delay between them
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20
    }
  }
}

export default function Result({ modelInfo, templateId }: { modelInfo?: ModelInfo; templateId: string }) {
  const [week, setWeek] = useState('1')

  useEffect(() => {
    console.log(templateId, 'templateId')
    switch (templateId) {
      case 'FOOD_TPL_M2_W1':
        setWeek('1')
        break
      case 'FOOD_TPL_W6':
        setWeek('2')
        break
      case 'FOOD_TPL_W7':
        setWeek('3')
        break
      case 'FOOD_TPL_W8':
        setWeek('4')
        break
      default:
        break
    }
  }, [templateId])

  return (
    // 3. Apply the container variants to a motion.div
    <motion.div className="px-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* 4. Animate the icon with its specific variant */}
      <motion.div variants={iconVariants}>
        <ApprovedIcon className="mx-auto mt-[50px]" />
      </motion.div>

      {/* 5. Apply the general item variant to other elements */}
      <motion.h2 variants={itemVariants} className="mt-8 text-center text-2xl font-bold">
        Submission approved!
      </motion.h2>

      <motion.div variants={itemVariants} className="mt-6">
        {modelInfo?.modelA.displayName && (
          <div className="flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
            <span>Model A</span>
            <div className="flex items-center">
              {modelInfo?.modelA.displayName}
              {week === '4' && modelInfo?.modelA.type && (
                <div className="ml-2 rounded-full bg-[#875DFF1F] px-[6px] text-xs leading-6">
                  {modelInfo?.modelA.type}
                </div>
              )}
            </div>
          </div>
        )}
        {modelInfo?.modelB.displayName && (
          <div className="mt-3 flex items-center justify-between rounded-full border border-[#FFFFFF1F] px-5 py-2 leading-8">
            <span>Model B</span>
            <div className="flex items-center">
              {modelInfo?.modelB.displayName}
              {week === '4' && modelInfo?.modelB.type && (
                <div className="ml-2 rounded-full bg-[#5DDD221F] px-[6px] text-xs leading-6">
                  {modelInfo?.modelB.type}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <motion.p variants={itemVariants} className="mt-6 text-center text-base text-[#BBBBBE]">
        {week === '4'
          ? 'Thank you for participating in our two-month model iteration journey. Your data submission and annotation contributed to the entire process, from data collection and cleaning to model fine-tuning and deployment. We sincerely appreciate your support in helping us improve our AI models.'
          : 'Thank you for your data annotation. We will use your submission for fine-tuning to improve our model capabilities.'}
      </motion.p>
    </motion.div>
  )
}
