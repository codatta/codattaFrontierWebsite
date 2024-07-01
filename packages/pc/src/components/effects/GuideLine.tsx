import { motion, useInView } from 'framer-motion'

import useScrollWithProgress from '@/hooks/useScrollWithProgress'
import './GuideLine.scss'
import { useRef } from 'react'

type TProps = {
  icon: string
  containerClassName: string,
  lineClassName: string
}

const AniLine = ({ className }: { className: string }) => {
  const { ref, progress } = useScrollWithProgress()

  return (
    <motion.div
      className={`w-4px ${className}`}
      style={{
        scaleY: progress,
        transformOrigin: 'top left',
        height: '100%',
      }}
      ref={ref}
    />
  )
}
const GuideLine = ({ containerClassName, lineClassName, icon }: TProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <motion.div
      className={`guide-line flex flex-col justify-between items-center ${containerClassName}`}
      ref={ref}
    >
      <img src={icon} className="w-48px h-48px" />
      {isInView ? (
        <AniLine className={lineClassName} />
      ) : (
        <div className='h-full'></div>
      )}
    </motion.div>
  )
}

export default GuideLine
