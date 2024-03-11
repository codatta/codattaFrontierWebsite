import React, { useRef } from 'react'
import './AniTitle.scss'
import { useInView } from 'framer-motion'

const AniTitle: React.FC<{
  t1: string
  t2: string
  des?: string
  color?: string
}> = ({ t1, t2, des, color = '#fff' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className={`ani-title ${isInView && 'ani'}`} ref={ref}>
      <div className="title-1 mt-12px">
        {t1.split(' ').map((text, index) => (
          <span key={text + index}>{text}&nbsp;</span>
        ))}
      </div>
      <div className={`title-2 color-${color} mt-24px`}>
        {t2.split(' ').map((text, index) => (
          <span key={text + index + 100}>{text}&nbsp;</span>
        ))}
      </div>
      {des && <div className="mt-24px des">{des}</div>}
    </div>
  )
}

export default AniTitle
