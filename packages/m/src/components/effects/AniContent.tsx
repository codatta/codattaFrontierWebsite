import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniContent.scss'

const AniContent: React.FC<{
  t: React.ReactNode | string
  des?: React.ReactNode | string
  className?: string
}> = ({ t, des, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-content ${isInView && 'ani'} ${className}`} ref={ref}>
      <div className="text-sm color-#fff font-semibold">{t}</div>
      <div className="mt-16px text-xs leading-5">{des}</div>
    </div>
  )
}

export default AniContent
