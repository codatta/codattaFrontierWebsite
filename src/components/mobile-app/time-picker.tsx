import React, { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface MobileTimePickerProps {
  value?: string | null
  onChange?: (time: string) => void
  placeholder?: string
}

const MobileTimePicker: React.FC<MobileTimePickerProps> = ({ value, onChange, placeholder = 'Time' }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Parse the time value (HH:mm format) and convert to 12-hour format
  const getInitialTime = () => {
    if (!value) return { hour: 9, minute: 41, period: 'AM' as 'AM' | 'PM' }

    const [hourStr, minuteStr] = value.split(':')
    const hour24 = parseInt(hourStr)
    const minute = parseInt(minuteStr)
    const period = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24

    return { hour: hour12, minute, period }
  }

  const initialTime = getInitialTime()
  const [selectedHour, setSelectedHour] = useState<number>(initialTime.hour)
  const [selectedMinute, setSelectedMinute] = useState<number>(initialTime.minute)
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(initialTime.period)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  // Generate arrays for hours and minutes
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // Format display
  const formatTime = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  const displayValue = value ? formatTime(selectedHour, selectedMinute, selectedPeriod) : placeholder

  const handleConfirm = () => {
    // Convert 12-hour format to 24-hour format
    let hour24: number
    if (selectedPeriod === 'PM') {
      hour24 = selectedHour === 12 ? 12 : selectedHour + 12
    } else {
      hour24 = selectedHour === 12 ? 0 : selectedHour
    }

    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
    onChange?.(timeString)
    setIsOpen(false)
  }

  // Scroll to selected item on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        // selectedHour is already in 12-hour format (1-12)
        hourRef.current?.children[selectedHour - 1 + 1]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        minuteRef.current?.children[selectedMinute + 1]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 100)
    }
  }, [isOpen, selectedHour, selectedMinute])

  return (
    <div className="relative">
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[17px] outline-none"
        style={{ color: value ? '#999' : '#3C3C434D' }}
      >
        {displayValue}
      </button>

      {/* Time Picker Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 animate-fade-in bg-black/30" onClick={() => setIsOpen(false)} />

          {/* Picker with frosted glass effect */}
          <div className="shadow-2xl fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[320px] animate-scale-in rounded-3xl bg-white/80 p-5 backdrop-blur-2xl [animation-fill-mode:both]">
            {/* Header */}
            <div className="mb-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Clock size={20} className="text-[#40E1EF]" />
                <span className="text-[20px] font-semibold text-black">Select Time</span>
              </div>
            </div>

            {/* Time Display */}
            <div className="mb-4 text-center text-[36px] font-semibold text-black">
              {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
            </div>

            {/* Scrollable Pickers */}
            <div className="mb-5 flex items-center justify-center gap-2">
              {/* Hour Picker */}
              <div className="relative h-[180px] w-20 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 z-10 h-[44px] -translate-y-1/2 border-y-2 border-[#40E1EF]/20 bg-[#40E1EF]/5" />
                <div
                  ref={hourRef}
                  className="scrollbar-hide h-full overflow-y-scroll"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="h-[68px]" />
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setSelectedHour(hour)}
                      className="flex h-[44px] w-full items-center justify-center text-[24px] font-medium transition-colors"
                      style={{
                        scrollSnapAlign: 'center',
                        color: selectedHour === hour ? '#000' : '#ccc'
                      }}
                    >
                      {hour}
                    </button>
                  ))}
                  <div className="h-[68px]" />
                </div>
              </div>

              <div className="text-[24px] font-bold text-black">:</div>

              {/* Minute Picker */}
              <div className="relative h-[180px] w-20 overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 z-10 h-[44px] -translate-y-1/2 border-y-2 border-[#40E1EF]/20 bg-[#40E1EF]/5" />
                <div
                  ref={minuteRef}
                  className="scrollbar-hide h-full overflow-y-scroll"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="h-[68px]" />
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => setSelectedMinute(minute)}
                      className="flex h-[44px] w-full items-center justify-center text-[24px] font-medium transition-colors"
                      style={{
                        scrollSnapAlign: 'center',
                        color: selectedMinute === minute ? '#000' : '#ccc'
                      }}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                  <div className="h-[68px]" />
                </div>
              </div>

              {/* AM/PM Picker */}
              <div className="ml-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('AM')}
                  className={`rounded-lg px-3 py-2 text-[16px] font-medium transition-colors ${
                    selectedPeriod === 'AM' ? 'bg-[#40E1EF] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('PM')}
                  className={`rounded-lg px-3 py-2 text-[16px] font-medium transition-colors ${
                    selectedPeriod === 'PM' ? 'bg-[#40E1EF] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2 text-[15px] font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-lg bg-[#40E1EF] px-4 py-2 text-[15px] font-medium text-white hover:bg-[#35c5d3]"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MobileTimePicker
