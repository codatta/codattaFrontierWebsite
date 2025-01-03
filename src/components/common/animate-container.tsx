import React, { useEffect, useRef } from 'react'

export default function AnimateContainer(props: { children: React.ReactNode; className?: string }) {
  const { children, className } = props
  const container = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = React.useState(0)

  function mutationCallback() {
    try {
      const children = container.current?.children || []
      let height = 0
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement
        height += child.offsetHeight
      }
      setMaxHeight(height)
    } catch (err: unknown) {
      console.error('Error calculating container height:', err)
    }
  }

  useEffect(() => {
    const observer = new MutationObserver(mutationCallback)
    observer.observe(container.current!, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    console.log('maxHeight', maxHeight)
  }, [maxHeight])

  return (
    <div
      ref={container}
      className={className}
      style={{
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        height: maxHeight
      }}
    >
      {children}
    </div>
  )
}
