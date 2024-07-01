import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniContent.scss'

const AniContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-content ${isInView && 'ani'} ${className}`} ref={ref}>
      {children}
    </div>
  )
}

export default AniContent
