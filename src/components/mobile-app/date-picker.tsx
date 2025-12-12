import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import { cn } from '@udecode/cn'

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

      {/* Calendar Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-300" onClick={handleCancel} />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 h-[500px] animate-slide-up rounded-t-3xl bg-white/80 px-5 pt-5 backdrop-blur-md">
            {/* Header with Close and Confirm buttons */}
            <div className="relative mb-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="flex size-10 items-center justify-center rounded-full bg-white/75 shadow-app-btn transition-all"
              >
                <Plus size={24} className="rotate-45 text-gray-600" />
              </button>
              <div className="text-[18px] font-bold text-black">
                {viewMode === 'date' && 'Select Date'}
                {viewMode === 'month' && 'Select Month'}
                {viewMode === 'year' && 'Select Year'}
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex size-10 items-center justify-center rounded-full bg-[#40E1EF] shadow-app-btn backdrop-blur-sm transition-all"
              >
                <Check size={20} className="text-white" />
              </button>
            </div>

            {/* Calendar Navigation */}
            <div className="mb-5 flex items-center gap-6">
              {viewMode === 'date' && (
                <>
                  <button
                    type="button"
                    onClick={handleTitleClick}
                    className="flex items-center gap-2 text-[17px] font-bold text-black"
                  >
                    {MONTHS[currentMonth.month()]} {currentMonth.year()}
                    <ChevronRight size={24} className="text-[#40E1EF]" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="ml-auto flex size-9 items-center justify-center transition-all"
                  >
                    <ChevronLeft size={24} className="text-[#40E1EF]" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="flex size-9 items-center justify-center transition-all"
                  >
                    <ChevronRight size={24} className="text-[#40E1EF]" />
                  </button>
                </>
              )}

              {viewMode === 'month' && (
                <>
                  <div className="text-[17px] font-bold text-black">{tempYear}</div>
                  <button
                    type="button"
                    onClick={() => setViewMode('year')}
                    className="ml-auto flex size-9 items-center justify-center transition-all"
                  >
                    <ChevronLeft size={24} className="text-[#40E1EF]" />
                  </button>
                </>
              )}

              {viewMode === 'year' && (
                <>
                  <div className="flex items-center gap-2 text-[17px] font-bold text-black">Select Year</div>
                  <button
                    type="button"
                    onClick={() => setViewMode('date')}
                    className="ml-auto flex size-9 items-center justify-center transition-all"
                  >
                    <ChevronLeft size={24} className="text-[#40E1EF]" />
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
                      <div className="flex w-full items-center justify-center">
                        {isCurrentMonth ? (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            disabled={disabled}
                            className={cn(
                              'flex size-10 items-center justify-center rounded-full text-[16px] transition-all',
                              selected && 'bg-black text-white',
                              !selected && !disabled && isCurrentMonth && 'text-black',
                              today && !selected && 'font-bold text-[#40E1EF]'
                            )}
                          >
                            {day.date()}
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
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
                      className={cn(
                        'rounded-2xl py-4 text-[15px] font-semibold transition-all',
                        isCurrentMonth ? 'bg-black text-white' : 'bg-white text-black'
                      )}
                    >
                      {month.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Year View */}
            {viewMode === 'year' && (
              <div className="scrollbar-hide box-border h-[360px] overflow-y-auto pb-5">
                <div className="grid grid-cols-3 gap-3 pb-5">
                  {years.map((year) => {
                    const isSelectedYear = tempSelectedDate ? year === tempSelectedDate.year() : false
                    const isCurrentYear = year === dayjs().year()
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={cn(
                          'rounded-2xl py-4 text-[15px] font-semibold transition-all',
                          isSelectedYear && 'bg-black text-white',
                          isCurrentYear && !isSelectedYear && 'bg-white text-[#40E1EF]',
                          !isCurrentYear && !isSelectedYear && 'bg-white text-black'
                        )}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default MobileDatePicker
