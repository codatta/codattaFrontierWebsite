import { useEffect, useState } from 'react'

interface UseDrawerAnimationOptions {
  lockBodyScroll?: boolean
}

interface UseDrawerAnimationResult {
  isVisible: boolean
  isAnimating: boolean
}

export function useDrawerAnimation(open: boolean, options: UseDrawerAnimationOptions = {}): UseDrawerAnimationResult {
  const { lockBodyScroll = true } = options
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      if (lockBodyScroll) {
        document.body.style.overflow = 'hidden'
      }
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      if (lockBodyScroll) {
        document.body.style.overflow = ''
      }
      return () => {
        clearTimeout(timer)
        if (lockBodyScroll) {
          document.body.style.overflow = ''
        }
      }
    }
  }, [open, lockBodyScroll])

  return { isVisible, isAnimating }
}
