import { motion, useInView } from 'framer-motion'

import useScrollWithProgress from '@/hooks/useScrollWithProgress'
import './GuideLine.scss'
import { useRef } from 'react'

type TProps = {
  icon: string
  className: string
  height: string
}

const AniLine = ({ className }: { className: string }) => {
  const { ref, progress } = useScrollWithProgress()

  return (
    <motion.div
      className={`w-4px ${className}`}
      style={{
        scaleY: progress,
        transformOrigin: 'top left',
      }}
      ref={ref}
    />
  )
}
const GuideLine = ({ className, height, icon }: TProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <motion.div
      className="flex flex-col justify-between items-center guide-line ml-14px mr-7px -mt-12px"
      ref={ref}
    >
      <img src={icon} className="w-48px h-48px" />
      {isInView ? (
        <AniLine className={className} />
      ) : (
        <div style={{ height: height }}></div>
      )}
    </motion.div>
  )
}

export default GuideLine
