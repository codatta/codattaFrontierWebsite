import { cn } from '@udecode/cn'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
export interface TaskTargetProps {
  match: [string, string]
  className?: string
  children?: JSX.Element
}
export default function TaskTarget(props: TaskTargetProps) {
  const [key, value] = props.match
  const { state } = useLocation()
  const [isTarget, setIsTarget] = useState(state?.[key] == value)

  const handleClick = useCallback(() => setIsTarget(false), [])

  useEffect(() => {
    setTimeout(() => {
      document.addEventListener('click', handleClick)
    }, 1500)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  return (
    <div
      className={cn(isTarget ? 'animate-pulse' : 'transition duration-500 ease-in-out', props.className)}
      onClick={() => {
        setIsTarget(false)
        history.replaceState(Object.assign({}, state, { [key]: null }), '')
      }}
    >
      {props.children}
    </div>
  )
}
