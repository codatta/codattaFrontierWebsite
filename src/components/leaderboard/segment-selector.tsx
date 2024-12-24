import { useEffect, useState, useRef } from 'react'
import { cn } from '@udecode/cn'

const SegmentSelector = (props: {
  defaultActive: string
  segments: { type: string; text: string }[]
  onSelect: (segment: string) => void
}) => {
  const { segments, onSelect } = props
  const [activeBgLeft, setActiveBgLeft] = useState(0)
  const [activeBgWidth, setActiveBgWidth] = useState(0)
  const [activeSegment, setActiveSegment] = useState(props.defaultActive)
  const segmentRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    const activeRef = segmentRefs.current[activeSegment]
    hanleButtonClick(activeRef!, activeSegment)
  }, [])

  function hanleButtonClick(target: HTMLButtonElement, segment: string) {
    setActiveSegment(segment)
    const width = target.offsetWidth
    const left = target.offsetLeft
    setActiveBgLeft(left - 4)
    setActiveBgWidth(width)
    onSelect(segment)
  }

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
            ref={(el) => (segmentRefs.current[item.type] = el)}
            key={item.type}
            className={cn(
              'font-600 flex-1 rounded-full bg-transparent px-4 py-1 text-[rgba(101,99,109,1)] transition-all',
              activeSegment === item.type ? 'text-white' : 'hover:text-primary'
            )}
            onClick={(e) => hanleButtonClick(e.target as HTMLButtonElement, item.type)}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SegmentSelector
