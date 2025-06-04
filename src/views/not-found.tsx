import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const [countdown] = useState(10)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const gridItemsRef = useRef<Array<HTMLDivElement | null>>([])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create digital space grid effect
  useEffect(() => {
    if (!containerRef.current) return

    gridItemsRef.current.forEach((item, _index) => {
      if (!item) return

      const rect = containerRef.current!.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      const itemX = itemRect.left - rect.left + itemRect.width / 2
      const itemY = itemRect.top - rect.top + itemRect.height / 2

      const dx = mousePosition.x - itemX
      const dy = mousePosition.y - itemY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2

      // Calculate distortion and glow effects
      const distanceRatio = Math.min(1, distance / maxDistance)
      const scale = 1 + (1 - distanceRatio) * 0.2
      const opacity = 0.3 + (1 - distanceRatio) * 0.7
      const translateZ = (1 - distanceRatio) * 20

      item.style.transform = `scale(${scale}) translateZ(${translateZ}px)`
      item.style.opacity = `${opacity}`
      item.style.boxShadow = `0 0 ${(1 - distanceRatio) * 20}px rgba(168, 85, 247, ${(1 - distanceRatio) * 0.8})`
    })
  }, [mousePosition])

  // Countdown to automatically return to home page
  // useEffect(() => {
  //   if (countdown <= 0) {
  //     navigate('/')
  //     return
  //   }

  //   const timer = setTimeout(() => {
  //     setCountdown(countdown - 1)
  //   }, 1000)

  //   return () => clearTimeout(timer)
  // }, [countdown, navigate])

  // Generate grid items
  const generateGridItems = () => {
    const items = []
    const rows = 12
    const cols = 12

    for (let i = 0; i < rows * cols; i++) {
      items.push(
        <div
          key={i}
          ref={(el) => (gridItemsRef.current[i] = el)}
          className="size-8 rounded-md bg-white/10 transition-all duration-300"
        />
      )
    }

    return items
  }

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden text-white">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_70%)]"></div>
      </div>

      {/* 3D Grid */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        <div className="rotate-x-[20deg] rotate-y-[10deg] transform-style-3d grid grid-cols-12 gap-4">
          {generateGridItems()}
        </div>
      </div>

      {/* Main content */}
      <div className="z-10 flex flex-col items-center justify-center space-y-8 px-4 text-center">
        <motion.h1
          className="text-9xl font-bold tracking-tighter text-transparent"
          style={{
            WebkitTextStroke: '2px rgba(168, 85, 247, 0.8)',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          404
        </motion.h1>

        <motion.div
          className="flex flex-col space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-medium text-white">Lost in Data Space</h2>
          <p className="max-w-md text-gray-400">
            You seem to have entered a non-existent dimension. Our system cannot find the page you requested.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={() => navigate('/')}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-purple-500 hover:to-purple-700"
          >
            <span className="relative z-10">Return Home</span>
            <span className="absolute inset-0 -z-10 translate-y-full bg-purple-500 transition-transform duration-300 group-hover:translate-y-0"></span>
          </button>

          <p className="text-sm text-gray-500">Returning home in {countdown} seconds</p>
        </motion.div>
      </div>

      {/* Digital space decorative elements */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>
  )
}

export default NotFoundPage
