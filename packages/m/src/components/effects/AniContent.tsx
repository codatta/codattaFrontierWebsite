import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniContent.scss'

const AniContent: React.FC<{
  t: string
  des: string
  className?: string
}> = ({ t, des, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-content ${isInView && 'ani'} ${className}`} ref={ref}>
      <div className="text-sm color-#fff font-bold">{t}</div>
      <div className="mt-8px text-xs">{des}</div>
    </div>
  )
}

export default AniContent
