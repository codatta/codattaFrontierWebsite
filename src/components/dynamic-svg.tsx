import { cn } from '@udecode/cn'
import React, { Suspense } from 'react'

// Function to dynamically import an SVG
export default function DynamicSvg({
  iconName,
  className,
}: {
  iconName: string
  className?: string
}) {
  const SvgIcon = React.lazy(async () => {
    const module = await import(`@/assets/icons/${iconName}.svg?react`)
    return { default: module.default }
  })

  return (
    <Suspense
      fallback={
        <div className={cn('text-black w-6 h-6 cursor-pointer', className)}>
          Loading...
        </div>
      }
    >
      {/* @ts-ignore */}
      <SvgIcon className={className} />
    </Suspense>
  )
}
