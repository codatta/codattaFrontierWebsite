import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

const useInViewWithAnimate = (duration = 2) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const animation = animate(progress, isInView ? 1 : 0, {
      duration: duration,
      onUpdate: (latest) => setProgress(latest),
    })

    return () => animation?.stop && animation.stop()
  }, [isInView])

  return { ref, progress, isInView }
}

export default useInViewWithAnimate
