import React, { useMemo, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BirthDateTime } from '../../types/common'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

interface MobileBirthPickerProps {
  value?: BirthDateTime
  onChange?: (value: BirthDateTime) => void
  placeholder?: string
  className?: string
}

const MobileBirthPicker: React.FC<MobileBirthPickerProps> = ({
  value,
  onChange,
  placeholder = 'Select Birthday',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState<BirthDateTime>(
    value || {
      year: new Date().getFullYear() - 25,
      month: 1,
      day: 1,
      hour: 12,
      minute: 0
    }
  )
  const isMobile = useIsMobile()

  // Generate options
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const days = Array.from({ length: getDaysInMonth(tempValue.year, tempValue.month) }, (_, i) => i + 1)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const formatDisplayValue = useMemo(() => {
    if (!value) return placeholder
    const { year, month, day, hour, minute } = value
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }, [value, placeholder])

  const handleConfirm = () => {
    onChange?.(tempValue)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempValue(
      value || {
        year: new Date().getFullYear() - 25,
        month: 1,
        day: 1,
        hour: 12,
        minute: 0
      }
    )
    setIsOpen(false)
  }

  const updateTempValue = (field: keyof BirthDateTime, newValue: number) => {
    setTempValue((prev) => {
      const updated = { ...prev, [field]: newValue }
      // Adjust day if it's invalid for the new month/year
      if (field === 'year' || field === 'month') {
        const maxDays = getDaysInMonth(updated.year, updated.month)
        if (updated.day > maxDays) {
          updated.day = maxDays
        }
      }
      return updated
    })
  }

  const getAnimationProps = () => {
    if (isMobile) {
      return {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' }
      }
    } else {
      return {
        initial: { opacity: 0, scale: 0.95, y: 0 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 0 }
      }
    }
  }

  return (
    <>
      <div className={`relative w-full ${className}`}>
        <div
          onClick={() => setIsOpen(true)}
          className="flex h-[40px] w-full cursor-pointer items-center justify-between rounded-lg border border-white/15 px-4 text-white transition-colors hover:bg-white/10"
        >
          <span className={`flex-1 truncate text-left ${!value ? 'text-gray-400' : 'text-white'}`}>
            {formatDisplayValue}
          </span>
          <ChevronDown className="size-5 text-gray-400 transition-transform" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black bg-opacity-70"
              onClick={handleCancel}
            />

            <motion.div
              {...getAnimationProps()}
              transition={
                isMobile
                  ? {
                      type: 'spring',
                      damping: 25,
                      stiffness: 300,
                      duration: 0.3
                    }
                  : {
                      type: 'tween',
                      ease: [0.25, 0.1, 0.25, 1],
                      duration: 0.2
                    }
              }
              className="relative w-full max-w-md rounded-t-2xl bg-[#1c1c26] text-white md:max-w-lg md:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 rounded-t-2xl bg-[#1c1c26]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-6">
                  <div
                    onClick={handleCancel}
                    className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-300"
                  >
                    Cancel
                  </div>
                  <h3 className="text-lg font-medium text-white">Select Birthday</h3>
                  <div
                    onClick={handleConfirm}
                    className="cursor-pointer text-sm font-medium text-primary/80 transition-colors hover:text-primary"
                  >
                    Confirm
                  </div>
                </div>
              </div>

              {/* Date Time Picker */}
              <div className="space-y-6 p-6">
                {/* Date Section */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-300">
                    Date<span className="text-red-400">*</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Year */}
                    <div className="pr-1">
                      <label className="mb-1 block text-xs text-gray-400">Year</label>
                      <select
                        value={tempValue.year}
                        onChange={(e) => updateTempValue('year', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        {years.map((year) => (
                          <option key={year} value={year} className="bg-[#1c1c26]">
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Month</label>
                      <select
                        value={tempValue.month}
                        onChange={(e) => updateTempValue('month', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        {months.map((month) => (
                          <option key={month} value={month} className="bg-[#1c1c26]">
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Day */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Day</label>
                      <select
                        value={tempValue.day}
                        onChange={(e) => updateTempValue('day', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        {days.map((day) => (
                          <option key={day} value={day} className="bg-[#1c1c26]">
                            {day.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Time Section */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-300">
                    Time<span className="text-red-400">*</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Hour */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Hour</label>
                      <select
                        value={tempValue.hour}
                        onChange={(e) => updateTempValue('hour', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        {hours.map((hour) => (
                          <option key={hour} value={hour} className="bg-[#1c1c26]">
                            {hour.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Minute */}
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">Minute</label>
                      <select
                        value={tempValue.minute}
                        onChange={(e) => updateTempValue('minute', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-primary focus:outline-none"
                      >
                        {minutes.map((minute) => (
                          <option key={minute} value={minute} className="bg-[#1c1c26]">
                            {minute.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 text-xs text-gray-400">Selected Date & Time</div>
                  <div className="text-sm font-medium text-white">
                    {tempValue.year}-{tempValue.month.toString().padStart(2, '0')}-
                    {tempValue.day.toString().padStart(2, '0')} {tempValue.hour.toString().padStart(2, '0')}:
                    {tempValue.minute.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileBirthPicker
