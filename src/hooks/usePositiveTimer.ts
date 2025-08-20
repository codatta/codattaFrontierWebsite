import { useState, useEffect, useRef } from 'react'

interface TimerOptions {
  initialSeconds?: number
  timeoutLimit?: number
  onTimeout?: () => void
}

export const usePositiveTimer = (options: TimerOptions = {}) => {
  const { initialSeconds = 0, timeoutLimit, onTimeout } = options
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onTimeoutRef = useRef(onTimeout)

  // Keep onTimeout ref up to date to avoid re-running the effect
  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    const tick = () => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1
        if (timeoutLimit && newSeconds >= timeoutLimit) {
          setIsActive(false)
          onTimeoutRef.current?.()
          return newSeconds
        }
        // Schedule the next tick
        timeoutRef.current = setTimeout(tick, 1000)
        return newSeconds
      })
    }

    if (isActive) {
      // Prevent starting if already at the limit
      if (!timeoutLimit || seconds < timeoutLimit) {
        timeoutRef.current = setTimeout(tick, 1000)
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isActive, seconds, timeoutLimit])

  const start = () => {
    if (!timeoutLimit || seconds < timeoutLimit) {
      setIsActive(true)
    }
  }

  const pause = () => {
    setIsActive(false)
  }

  const reset = () => {
    setIsActive(false)
    setSeconds(initialSeconds)
  }

  return { seconds, start, pause, reset }
}
