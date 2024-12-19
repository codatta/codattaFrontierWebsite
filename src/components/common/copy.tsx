import { cn } from '@udecode/cn'
import { Copy } from 'lucide-react'
import { MouseEventHandler, useState } from 'react'

export default function CopyAction(props: {
  content?: string
  size?: number
  onClick?: MouseEventHandler
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const size = props.size ?? 14

  const handleClick: MouseEventHandler = (e) => {
    e.stopPropagation()

    props.onClick?.(e)
    navigator.clipboard.writeText(props.content || '')

    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <>
      {copied ? (
        <span
          className={cn(
            'line-height-none text-nowrap text-gray-900',
            props.className
          )}
        >
          Copied!
        </span>
      ) : (
        <Copy
          size={size}
          onClick={handleClick}
          className={cn('cursor-pointer', props.className)}
        />
      )}
    </>
  )
}
