import { motion } from 'framer-motion'

import ApprovedIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg?react'

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

export default function Result() {
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

      <motion.p variants={itemVariants} className="mt-6 text-center text-base text-[#BBBBBE]">
        Thank you for annotating robotics data! Your contribution helps advance the robotics industry.
      </motion.p>
    </motion.div>
  )
}
