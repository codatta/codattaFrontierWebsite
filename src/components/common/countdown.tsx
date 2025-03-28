import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

export default function CountDown(props: { gmt: string; onTimeout?: () => void; className?: string }) {
  const { gmt } = props
  const [hour, setHour] = useState('00')
  const [min, setMin] = useState('00')
  const endDate = useMemo(() => dayjs.utc(gmt), [gmt])
  useEffect(() => {
    const calc = () => {
      const diff = endDate.diff()
      const dur = dayjs.duration(diff)
      const hour = dur.hours()
      setHour((hour + '').padStart(2, '0'))
      const min = dur.minutes()
      setMin((min + '').padStart(2, '0'))
      if (hour <= 0 && min <= 0) {
        props.onTimeout?.()
      }
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [endDate, props])

  return (
    <span className={props.className}>
      {hour} : {min}
    </span>
  )
}
