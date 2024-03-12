import * as React from 'react'
import { motion } from 'framer-motion'

import './UsageCard.scss'

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: 'rgba(255, 255, 255, 0)',
  },
  visible2: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255, 255, 255, 1)',
  },
}

const UsageCard = () => {
  const [ani, setAni] = React.useState('hidden')

  React.useEffect(() => {
    setTimeout(() => {
      setAni('visible2')
    }, 2000)
  }, [])

  return (
    <div className="container">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="item"
      >
        <motion.path
          d="M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z"
          variants={icon}
          initial="hidden"
          animate={ani}
          transition={{
            default: { duration: 2, ease: 'easeInOut' },
            fill: { duration: 2, ease: [1, 0, 0.8, 1] },
          }}
        />
      </motion.svg>
    </div>
  )
}

export default UsageCard
