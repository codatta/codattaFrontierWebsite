import { useRef, useState } from 'react'

import { motion } from 'framer-motion'
import './EffectCard.scss'

const EffectCard = ({
  children,
  className,
  color,
}: {
  children: React.ReactNode
  className?: string
  color?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [showShine, setShowShine] = useState(false)

  const handleMouseMove = (event: { clientX: any; clientY: any }) => {
    const { clientX, clientY } = event

    if (!ref.current) return

    const containerRect = ref.current.getBoundingClientRect()

    // 计算相对于容器的位置
    const width = containerRect.width
    const height = containerRect.height
    const x = clientX - containerRect.left
    const y = clientY - containerRect.top

    setMousePosition({ x: x, y: y })
    setRotation({
      x: (-(x - width * 0.5) / width) * 2,
      y: ((y - height * 0.5) / height) * 3,
    })
  }

  const handleMouseEnter = () => {
    setShowShine(true)
  }

  const handleMouseLeave = () => {
    setShowShine(false)
  }

  return (
    <motion.div
      className={`skew-card relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      style={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        perspective: 700,
      }}
    >
      {children}
      <motion.div
        className={`shine ${showShine ? 'opacity-10' : 'opacity-0'}`}
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
          backgroundColor: color || '#3fb950',
        }}
      >
        X: {mousePosition.x},Y: {mousePosition.y}
      </motion.div>
    </motion.div>
  )
}

export default EffectCard
