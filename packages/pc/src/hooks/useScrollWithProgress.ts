import { useRef, useEffect } from 'react'
import { useScroll, useSpring, useTransform } from 'framer-motion'

const useScrollWithProgress = (
  offsetRange = [0, 1],
  springConfig = { stiffness: 500, damping: 90 }
) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })

  const progress = useSpring(
    useTransform(scrollYProgress, offsetRange, [0, 1]),
    springConfig
  )

  useEffect(() => {
    // Log the scroll progress without using useMotionValueEvent
    console.log('Page scroll: ', scrollYProgress.get())
  }, [scrollYProgress])

  return { ref, progress }
}

export default useScrollWithProgress
