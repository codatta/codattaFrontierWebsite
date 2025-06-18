import { useState, useEffect, useCallback } from 'react'

export const useCountdown = (initialSeconds: number, onTimeout?: () => void): [number, boolean, () => void] => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [ended, setEnded] = useState(true)

  const restart = useCallback(() => {
    setEnded(false)
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    restart()
  }, [restart])

  useEffect(() => {
    if (ended) {
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
  }, [seconds, onTimeout, ended])

  return [seconds, ended, restart]
}
