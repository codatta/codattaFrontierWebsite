import { formatNumber } from '@/utils/str'
import React, { useState, useRef, useEffect } from 'react'

type TProps = {
  num: number
  className?: string
  prefix?: string
}
const NumberAnimation = ({ num, className, prefix = '' }: TProps) => {
  const [number, setNumber] = useState<number>(0)
  const last = useRef(0)
  const step = useRef((num - last.current) / 30)
  const timer = useRef(null)

  useEffect(() => {
    step.current = (num - last.current) / 30
  }, [num])

  useEffect(() => {
    const change = () => {
      // console.log('lastC', last.current, num, step)
      if (last.current < num) {
        last.current = Math.min(num, Math.ceil(last.current + step.current))
        setNumber(last.current)
      } else if (last.current > num) {
        last.current = Math.max(num, Math.floor(last.current + step.current))
        setNumber(last.current)
      }
    }

    clearTimeout(timer.current)
    timer.current = setTimeout(change, 30)

    return () => clearTimeout(timer.current)
  }, [number, num])

  return (
    <span className={className}>
      {number > 0 ? `${prefix}${formatNumber(number)}` : formatNumber(number)}
    </span>
  )
}

export default NumberAnimation
