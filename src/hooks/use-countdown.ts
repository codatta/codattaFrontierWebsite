import { useState, useEffect, useCallback } from 'react'

export const useCountdown = (
  initialSeconds: number,
  options?: { onTimeout?: () => void; autoStart?: boolean }
): [number, boolean, () => void] => {
  const { onTimeout, autoStart = true } = options || {}
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isReady, setIsReady] = useState(autoStart)
  const [ended, setEnded] = useState(false)

  const restart = useCallback(() => {
    setSeconds(initialSeconds)
    setEnded(false)
    setIsReady(true)
  }, [initialSeconds])

  useEffect(() => {
    if (!isReady || ended) {
      return
    }

    if (seconds <= 0) {
      setEnded(true)
      onTimeout?.()
      return
    }

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds, onTimeout, ended, isReady])

  return [seconds, ended, restart]
}
