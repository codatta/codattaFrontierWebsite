import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import './AniTitle.scss'

const AniTitle: React.FC<{
  t1: string
  t2: string
  des?: React.ReactNode | string
  color?: string
}> = ({ t1, t2, des, color = '#fff' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  return (
    <div className={`ani-title ${isInView && 'ani'}`} ref={ref}>
      <div className="text-base tracking-tight font-bold text-#fff">
        {t1.split(' ').map((text, index) => (
          <span key={text + index}>{text}&nbsp;</span>
        ))}
      </div>
      <div className={`text-xl tracking-tight font-medium color-${color} mt-4`}>
        {t2.split(' ').map((text, index) => (
          <span key={text + index + 100}>{text}&nbsp;</span>
        ))}
      </div>
      {des && <div className="mt-16px des text-xs">{des}</div>}
    </div>
  )
}

export default AniTitle
