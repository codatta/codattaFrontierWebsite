import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniContent.scss'

const AniContent: React.FC<{
  t: string
  des?: React.ReactNode | string
  className?: string
}> = ({ t, des, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-content ${isInView && 'ani'} ${className}`} ref={ref}>
      <div className="title-2">{t}</div>
      <div className="text-lg leading-26px text-#FFFFFF73">{des}</div>
    </div>
  )
}

export default AniContent
