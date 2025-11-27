import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'

interface MobileDatePickerProps {
  value?: string | null
  onChange?: (date: string) => void
  placeholder?: string
  minDate?: string
  maxDate?: string
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const MobileDatePicker: React.FC<MobileDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select',
  minDate,
  maxDate
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedDate = value ? dayjs(value) : null
  const [currentMonth, setCurrentMonth] = useState(selectedDate || dayjs())
  const [tempSelectedDate, setTempSelectedDate] = useState<Dayjs | null>(selectedDate)
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date')
  const [tempYear, setTempYear] = useState(currentMonth.year())

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startDate = startOfMonth.startOf('week')
    const endDate = endOfMonth.endOf('week')

    const days: (Dayjs | null)[] = []
    let day = startDate

    while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
      days.push(day)
      day = day.add(1, 'day')
    }

    return days
  }, [currentMonth])

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  const handleDateSelect = (date: Dayjs) => {
    if (!isDateDisabled(date)) {
      setTempSelectedDate(date)
    }
  }

  const handleConfirm = () => {
    if (tempSelectedDate) {
      onChange?.(tempSelectedDate.format('YYYY-MM-DD'))
    }
    setViewMode('date')
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempSelectedDate(selectedDate)
    setViewMode('date')
    setIsOpen(false)
  }

  const handleToday = () => {
    const today = dayjs()
    setTempSelectedDate(today)
    setCurrentMonth(today)
    setViewMode('date')
  }

  const handleTitleClick = () => {
    if (viewMode === 'date') {
      setViewMode('year')
      setTempYear(currentMonth.year())
    } else if (viewMode === 'month') {
      setViewMode('year')
    } else {
      setViewMode('date')
    }
  }

  const handleYearSelect = (year: number) => {
    setTempYear(year)
    setViewMode('month')
  }

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(dayjs().year(tempYear).month(month))
    setViewMode('date')
  }

  // Generate years array (current year ± 50 years)
  const years = useMemo(() => {
    const currentYear = dayjs().year()
    return Array.from({ length: 101 }, (_, i) => currentYear - 50 + i)
  }, [])

  const isDateDisabled = (date: Dayjs) => {
    if (minDate && date.isBefore(dayjs(minDate), 'day')) return true
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true
    return false
  }

  const isToday = (date: Dayjs) => {
    return date.isSame(dayjs(), 'day')
  }

  const isSelected = (date: Dayjs) => {
    return tempSelectedDate && date.isSame(tempSelectedDate, 'day')
  }

  const displayValue = selectedDate ? selectedDate.format('MMM D, YYYY') : placeholder

  return (
    <div className="relative">
      {/* Input Display */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen) {
            setTempSelectedDate(selectedDate)
            setViewMode('date')
          }
          setIsOpen(!isOpen)
        }}
        className="text-[17px] outline-none"
        style={{ color: value ? '#999' : '#3C3C434D' }}
      >
        {displayValue}
      </button>

      {/* Calendar Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 animate-fade-in bg-black/20" onClick={handleCancel} />

          {/* Calendar with frosted glass effect */}
          <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[360px] animate-scale-in rounded-3xl bg-white/60 p-5 shadow-app-btn backdrop-blur-md [animation-fill-mode:both]">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              {viewMode === 'date' && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="hover:shadow-md flex size-9 items-center justify-center rounded-xl bg-white/60 transition-all hover:bg-white/80"
                  >
                    <ChevronLeft size={20} className="text-[#40E1EF]" />
                  </button>

                  <button
                    type="button"
                    onClick={handleTitleClick}
                    className="text-[20px] font-bold text-gray-800 transition-colors hover:text-[#40E1EF]"
                  >
                    {MONTHS[currentMonth.month()]} {currentMonth.year()}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="hover:shadow-md flex size-9 items-center justify-center rounded-xl bg-white/60 transition-all hover:bg-white/80"
                  >
                    <ChevronRight size={20} className="text-[#40E1EF]" />
                  </button>
                </>
              )}

              {viewMode === 'month' && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewMode('year')}
                    className="hover:shadow-md flex size-9 items-center justify-center rounded-xl bg-white/60 transition-all hover:bg-white/80"
                  >
                    <ChevronLeft size={20} className="text-[#40E1EF]" />
                  </button>

                  <div className="text-[20px] font-bold text-gray-800">{tempYear}</div>

                  <div className="size-9"></div>
                </>
              )}

              {viewMode === 'year' && (
                <>
                  <div className="size-9"></div>
                  <div className="text-[20px] font-bold text-gray-800">Select Year</div>
                  <button
                    type="button"
                    onClick={() => setViewMode('date')}
                    className="hover:shadow-md flex size-9 items-center justify-center rounded-xl bg-white/60 transition-all hover:bg-white/80"
                  >
                    <ChevronLeft size={20} className="text-[#40E1EF]" />
                  </button>
                </>
              )}
            </div>

            {/* Date View */}
            {viewMode === 'date' && (
              <>
                {/* Weekday Headers */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-[11px] font-semibold text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} />

                    const isCurrentMonth = day.month() === currentMonth.month()
                    const disabled = isDateDisabled(day)
                    const selected = isSelected(day)
                    const today = isToday(day)

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        disabled={disabled}
                        className={`flex size-10 items-center justify-center rounded-full text-[17px] font-medium transition-all ${!isCurrentMonth ? 'text-gray-300' : ''} ${disabled ? 'cursor-not-allowed text-gray-300' : ''} ${selected ? 'shadow-lg bg-[#40E1EF] text-white shadow-[#40E1EF]/30' : ''} ${!selected && !disabled && isCurrentMonth ? 'text-gray-700 hover:bg-white/80' : ''} ${today && !selected ? 'font-bold text-[#40E1EF]' : ''} `}
                      >
                        {day.date()}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-3 gap-3">
                {MONTHS.map((month, index) => {
                  const isCurrentMonth = index === currentMonth.month() && tempYear === currentMonth.year()
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className={`rounded-2xl py-4 text-[15px] font-semibold transition-all ${
                        isCurrentMonth
                          ? 'shadow-lg bg-[#40E1EF] text-white shadow-[#40E1EF]/30'
                          : 'hover:shadow-md bg-white/60 text-gray-700 hover:bg-white/80'
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Year View */}
            {viewMode === 'year' && (
              <div className="scrollbar-hide max-h-[300px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-3">
                  {years.map((year) => {
                    const isCurrentYear = year === currentMonth.year()
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={`rounded-2xl py-4 text-[15px] font-semibold transition-all ${
                          isCurrentYear
                            ? 'shadow-lg bg-[#40E1EF] text-white shadow-[#40E1EF]/30'
                            : 'hover:shadow-md bg-white/60 text-gray-700 hover:bg-white/80'
                        }`}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Footer - Today Button */}
            <div className="mt-5 flex justify-between gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="hover:shadow-md rounded-xl bg-white/60 px-5 py-2.5 text-[15px] font-semibold text-gray-600 transition-all hover:bg-white/80"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleToday}
                  className="hover:shadow-md rounded-xl bg-white/60 px-5 py-2.5 text-[15px] font-semibold text-[#40E1EF] transition-all hover:bg-white/80"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="shadow-lg hover:shadow-xl rounded-xl bg-[#40E1EF] px-5 py-2.5 text-[15px] font-semibold text-white shadow-[#40E1EF]/30 transition-all hover:bg-[#35c5d3]"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MobileDatePicker
