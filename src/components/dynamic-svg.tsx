import { cn } from '@udecode/cn'
import React, { Suspense } from 'react'

// Function to dynamically import an SVG
export default function DynamicSvg({
  iconName,
  className,
  onClick,
}: {
  iconName: string
  className?: string
  onClick?: () => void
}) {
  const SvgIcon = React.lazy(async () => {
    const module = await import(`@/assets/icons/${iconName}.svg?react`)
    return { default: module.default }
  })

  return (
    <Suspense
      fallback={
        <div
          className={cn('text-black w-6 h-6 cursor-pointer', className)}
        ></div>
      }
    >
      {/* @ts-ignore */}
      <SvgIcon className={className} onClick={() => onClick?.()} />
    </Suspense>
  )
}
