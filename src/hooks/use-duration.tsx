import dayjs, { Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useDuration(endTime: string | number | Dayjs, onTimeout?: () => void) {
  const endDate = useMemo(() => dayjs.utc(endTime), [endTime])
  const getDur = useCallback(() => dayjs.duration(endDate.diff()), [endDate])
  const [dur, setDur] = useState(getDur())
  const [timeoutSent, setTimeoutSent] = useState(false)

  useEffect(() => {
    if (timeoutSent) return
    const interval = setInterval(() => {
      const _dur = getDur()
      if (_dur.asMilliseconds() < 0 && !timeoutSent) {
        onTimeout?.()
        setTimeoutSent(true)
      }
      setDur(_dur)
    }, 1000)
    return () => clearInterval(interval)
  }, [getDur, onTimeout, timeoutSent])
  return dur
}
