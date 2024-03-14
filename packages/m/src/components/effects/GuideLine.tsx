import useScrollWithProgress from '@/hooks/useScrollWithProgress'
import { motion } from 'framer-motion'

import './GuideLine.scss'

type TProps = {
  icon: string
  className: string
}
const GuideLine = ({ className, icon }: TProps) => {
  const { ref, progress } = useScrollWithProgress([0, 1], {
    stiffness: 300,
    damping: 80,
  })

  return (
    <motion.div
      className="flex flex-col justify-between items-center guide-line ml-14px mr-7px"
      ref={ref}
    >
      <img src={icon} className="w-48px h-48px" />
      <motion.div
        className={`w-4px ${className}`}
        style={{
          scaleY: progress,
          transformOrigin: 'top left',
        }}
      />
    </motion.div>
  )
}

export default GuideLine
