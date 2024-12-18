import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'

const SegmentSelector = (props: {
  defaultActive: string
  segments: { type: string; text: string }[]
  onSelect: (segment: string) => void
}) => {
  const { segments, onSelect, defaultActive } = props
  const [tab, setTab] = useState<string>(defaultActive)
  const [target, setTarget] = useState<HTMLButtonElement | null>(null)
  const [activeBgLeft, setActiveBgLeft] = useState(0)
  const [activeBgWidth, setActiveBgWidth] = useState(0)

  useEffect(() => {
    if (!tab || !target) return
    setTab(tab)
    const width = target.offsetWidth
    const left = target.offsetLeft
    setActiveBgLeft(left - 4)
    setActiveBgWidth(width)
    onSelect(tab)
  }, [tab, target, onSelect])

  return (
    <div className="relative flex w-auto">
      <div className="absolute size-full overflow-hidden rounded-full p-1">
        <div
          className="relative h-full rounded-full bg-primary transition-all"
          style={{ left: activeBgLeft, width: activeBgWidth }}
        ></div>
      </div>
      <div className="relative flex justify-around whitespace-nowrap rounded-full border border-gray-300 p-1">
        {segments.map((item, _index) => (
          <button
            ref={item.type === defaultActive ? setTarget : null}
            key={item.type}
            className={cn(
              'flex-1 rounded-full bg-transparent px-4 py-1 font-semibold text-[rgba(101,99,109,1)] transition-all',
              tab === item.type ? 'text-white' : 'hover:text-primary'
            )}
            onClick={(e) => {
              setTarget(e.currentTarget as HTMLButtonElement)
              setTab(item.type)
            }}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SegmentSelector
