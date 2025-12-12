import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Check } from 'lucide-react'

interface ScrollTimePickerProps {
  value?: string | null
  onChange?: (time: string) => void
  placeholder?: string
  showSeconds?: boolean
}

const ScrollTimePicker: React.FC<ScrollTimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select',
  showSeconds = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Parse the time value (HH:mm or HH:mm:ss format)
  const getInitialTime = () => {
    if (!value) return { hour: 9, minute: 41, second: 0 }

    const parts = value.split(':')
    const hour = parseInt(parts[0]) || 9
    const minute = parseInt(parts[1]) || 41
    const second = parts[2] ? parseInt(parts[2]) : 0

    return { hour, minute, second }
  }

  const initialTime = getInitialTime()
  const [selectedHour, setSelectedHour] = useState<number>(initialTime.hour)
  const [selectedMinute, setSelectedMinute] = useState<number>(initialTime.minute)
  const [selectedSecond, setSelectedSecond] = useState<number>(initialTime.second)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate arrays
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const seconds = Array.from({ length: 60 }, (_, i) => i)

  const itemHeight = 44 // Height of each item in px

  // Format display
  const formatTime = (hour: number, minute: number, second?: number) => {
    if (showSeconds && second !== undefined) {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const displayValue = value ? formatTime(selectedHour, selectedMinute, selectedSecond) : placeholder

  const handleConfirm = () => {
    const timeString = formatTime(selectedHour, selectedMinute, showSeconds ? selectedSecond : undefined)
    onChange?.(timeString)
    setIsOpen(false)
  }

  const handleCancel = () => {
    const initial = getInitialTime()
    setSelectedHour(initial.hour)
    setSelectedMinute(initial.minute)
    setSelectedSecond(initial.second)
    setIsOpen(false)
  }

  // Snap scroll to nearest item
  const snapScroll = useCallback(
    (ref: React.RefObject<HTMLDivElement>, setValue: (value: number) => void, maxValue: number) => {
      if (!ref.current) return

      const scrollTop = ref.current.scrollTop
      const index = Math.round(scrollTop / itemHeight)
      const clampedIndex = Math.max(0, Math.min(index, maxValue))

      setValue(clampedIndex)
      ref.current.scrollTo({
        top: clampedIndex * itemHeight,
        behavior: 'smooth'
      })
    },
    [itemHeight]
  )

  // Handle scroll with debounce
  const handleScroll = useCallback(
    (ref: React.RefObject<HTMLDivElement>, setValue: (value: number) => void, maxValue: number) => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }

      scrollTimerRef.current = setTimeout(() => {
        snapScroll(ref, setValue, maxValue)
      }, 150)
    },
    [snapScroll]
  )

  // Scroll to selected item on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourRef.current) {
          hourRef.current.scrollTop = selectedHour * itemHeight
        }
        if (minuteRef.current) {
          minuteRef.current.scrollTop = selectedMinute * itemHeight
        }
        if (secondRef.current && showSeconds) {
          secondRef.current.scrollTop = selectedSecond * itemHeight
        }
      }, 100)
    }
  }, [isOpen])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      {/* Input Display */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            const initial = getInitialTime()
            setSelectedHour(initial.hour)
            setSelectedMinute(initial.minute)
            setSelectedSecond(initial.second)
          }
          setIsOpen(!isOpen)
        }}
        className="text-[17px] outline-none"
        style={{ color: value ? '#999' : '#3C3C434D' }}
      >
        {displayValue}
      </button>

      {/* Time Picker Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-300" onClick={handleCancel} />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl bg-white/80 p-5 pb-8 backdrop-blur-md">
            {/* Header with Close and Confirm buttons */}
            <div className="relative mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="flex size-10 items-center justify-center rounded-full bg-white/75 shadow-app-btn transition-all"
              >
                <Plus size={24} className="rotate-45 text-gray-600" />
              </button>
              <div className="text-[18px] font-bold text-black">Select Time</div>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex size-10 items-center justify-center rounded-full bg-[#40E1EF] shadow-app-btn backdrop-blur-sm transition-all"
              >
                <Check size={20} className="text-white" />
              </button>
            </div>

            {/* Labels */}
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="flex-1 text-center text-[13px] font-semibold text-gray-500">Hour</div>
              <div className="w-6"></div>
              <div className="flex-1 text-center text-[13px] font-semibold text-gray-500">Min</div>
              {showSeconds && (
                <>
                  <div className="w-6"></div>
                  <div className="flex-1 text-center text-[13px] font-semibold text-gray-500">Sec</div>
                </>
              )}
            </div>

            {/* Scrollable Pickers Container */}
            <div className="relative mb-5 flex items-center justify-center gap-2 px-2">
              {/* Selection highlight bar */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 mx-2 h-[56px] -translate-y-1/2 rounded-full bg-white/75" />

              {/* Hour Picker */}
              <div className="relative flex flex-1">
                <div className="relative h-[220px] w-full overflow-hidden">
                  <div
                    ref={hourRef}
                    className="scrollbar-hide h-full overflow-y-scroll"
                    style={{ scrollSnapType: 'y mandatory' }}
                    onScroll={() => handleScroll(hourRef, setSelectedHour, hours.length - 1)}
                  >
                    <div className="h-[88px]" />
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="flex h-[44px] items-center justify-center text-[28px] font-semibold transition-all duration-200"
                        style={{
                          scrollSnapAlign: 'center',
                          color: selectedHour === hour ? '#1f2937' : '#d1d5db',
                          transform: selectedHour === hour ? 'scale(1)' : 'scale(0.85)'
                        }}
                        onClick={() => {
                          setSelectedHour(hour)
                          if (hourRef.current) {
                            hourRef.current.scrollTo({ top: hour * itemHeight, behavior: 'smooth' })
                          }
                        }}
                      >
                        {hour.toString().padStart(2, '0')}
                      </div>
                    ))}
                    <div className="h-[88px]" />
                  </div>
                </div>
              </div>

              <div className="z-20 text-[20px] font-bold text-gray-400">:</div>

              {/* Minute Picker */}
              <div className="relative flex flex-1">
                <div className="relative h-[220px] w-full overflow-hidden">
                  <div
                    ref={minuteRef}
                    className="scrollbar-hide h-full overflow-y-scroll"
                    style={{ scrollSnapType: 'y mandatory' }}
                    onScroll={() => handleScroll(minuteRef, setSelectedMinute, minutes.length - 1)}
                  >
                    <div className="h-[88px]" />
                    {minutes.map((minute) => (
                      <div
                        key={minute}
                        className="flex h-[44px] items-center justify-center text-[28px] font-semibold transition-all duration-200"
                        style={{
                          scrollSnapAlign: 'center',
                          color: selectedMinute === minute ? '#1f2937' : '#d1d5db',
                          transform: selectedMinute === minute ? 'scale(1)' : 'scale(0.85)'
                        }}
                        onClick={() => {
                          setSelectedMinute(minute)
                          if (minuteRef.current) {
                            minuteRef.current.scrollTo({ top: minute * itemHeight, behavior: 'smooth' })
                          }
                        }}
                      >
                        {minute.toString().padStart(2, '0')}
                      </div>
                    ))}
                    <div className="h-[88px]" />
                  </div>
                </div>
              </div>

              {/* Second Picker (conditional) */}
              {showSeconds && (
                <>
                  <div className="z-20 text-[20px] font-bold text-gray-400">:</div>
                  <div className="relative flex flex-1">
                    <div className="relative h-[220px] w-full overflow-hidden">
                      <div
                        ref={secondRef}
                        className="scrollbar-hide h-full overflow-y-scroll"
                        style={{ scrollSnapType: 'y mandatory' }}
                        onScroll={() => handleScroll(secondRef, setSelectedSecond, seconds.length - 1)}
                      >
                        <div className="h-[88px]" />
                        {seconds.map((second) => (
                          <div
                            key={second}
                            className="flex h-[44px] items-center justify-center text-[28px] font-semibold transition-all duration-200"
                            style={{
                              scrollSnapAlign: 'center',
                              color: selectedSecond === second ? '#1f2937' : '#d1d5db',
                              transform: selectedSecond === second ? 'scale(1)' : 'scale(0.85)'
                            }}
                            onClick={() => {
                              setSelectedSecond(second)
                              if (secondRef.current) {
                                secondRef.current.scrollTo({ top: second * itemHeight, behavior: 'smooth' })
                              }
                            }}
                          >
                            {second.toString().padStart(2, '0')}
                          </div>
                        ))}
                        <div className="h-[88px]" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ScrollTimePicker
