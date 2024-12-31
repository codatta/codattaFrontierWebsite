import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { message, Spin } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { cn } from '@udecode/cn'

import checkinIcon from '@/assets/checkin/check-in-icon.png'
import checkinNeonIcon from '@/assets/checkin/check-in-neon.svg'
import CheckInHeadBg from '@/assets/checkin/check-in-bg.png'

import taskApi from '@/apis/task.api'
import { checkinStoreActions } from '@/stores/checkin.store'

interface TCalendarCell {
  key: string
  value: number | null
  isCheckedin?: boolean
  isToday?: boolean
}

export default function CalenderView({ className = '' }: { className?: string }) {
  // State
  const [dateArray, setDateArray] = useState<TCalendarCell[]>([])
  const [checkinHistory, setCheckinHistory] = useState<string[]>([])
  const [totalCheckinCount, setTotalCheckinCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().utc())
  const [calendarRows, setCalendarRows] = useState<number[]>([])

  // Computed
  const checkDisabled = useMemo(() => selectedDate.startOf('month') >= dayjs().startOf('month'), [selectedDate])

  // Handlers
  const handleDateClick = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      setSelectedDate((prev) => prev.add(-1, 'month'))
    } else if (type === 'next' && !checkDisabled) {
      setSelectedDate((prev) => prev.add(1, 'month'))
    }
  }

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      await checkinStoreActions.checkin()
      await getCheckinHistory(selectedDate)
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Check in failed')
    }
    setLoading(false)
    await checkinStoreActions.reloadCheckin()
  }

  // API Calls
  const getCheckinHistory = async (date: Dayjs) => {
    setLoading(true)
    try {
      const month = date.utc().month() + 1
      const year = date.utc().year()
      const res = await taskApi.getCheckinHistory(year, month)

      setTotalCheckinCount(res.data.total_count)
      setCheckinHistory(res.data.check_in_history.map((item) => item.check_in_date))
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Failed to get checkin history')
    }
    setLoading(false)
  }

  // Calendar Generation
  const generateCalendarData = (date: Dayjs, historyData: string[]) => {
    const firstDateDay = date.startOf('month').day()
    const daysInMonth = date.endOf('month').date()
    const totalDays = firstDateDay + daysInMonth
    const rowCount = Math.ceil(totalDays / 7)

    setCalendarRows(Array.from({ length: rowCount }, (_, i) => i))

    const utcTodayStr = dayjs().utc().format('YYYY-MM-DD')
    const result: TCalendarCell[] = []

    for (let i = 0; i < totalDays; i++) {
      if (i < firstDateDay) {
        result[i] = { key: `${i}`, value: null }
        continue
      }

      const dateOfMonth = i - firstDateDay + 1
      const dateStr = date.date(dateOfMonth).utc(false).format('YYYY-MM-DD')
      const isToday = date.date(dateOfMonth).format('YYYY-MM-DD') === utcTodayStr
      const isCheckedin = historyData.includes(dateStr)
      const key = `${i}-${isCheckedin}-${isToday}`

      result[i] = {
        key,
        isCheckedin,
        isToday,
        value: dateOfMonth
      }
    }

    setDateArray(result)
  }

  useEffect(() => {
    getCheckinHistory(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    generateCalendarData(selectedDate, checkinHistory)
  }, [selectedDate, checkinHistory])

  return (
    <div className={className}>
      <Spin spinning={loading} indicator={<Loader2 className="animate-spin text-white" />} size="large">
        <div className="w-full rounded-t-3xl bg-primary p-6" style={{ backgroundImage: `url(${CheckInHeadBg})` }}>
          <div className="text-2xl font-bold leading-9 text-white">Daily Check-in</div>
          <div className="relative mt-4 flex items-center">
            <div className="text-sm text-white">
              <span className="text-[18px]">{totalCheckinCount}</span> day streak
            </div>
            <div className="ml-auto flex gap-4">
              <div className="flex h-9 w-[160px] justify-between gap-2 rounded-[36px] bg-white px-3 py-[6px] text-base text-gray">
                <LeftOutlined className={cn('shrink-0')} onClick={() => handleDateClick('prev')} />
                <div>
                  {selectedDate.format('MMM')} {selectedDate.format('YYYY')}
                </div>
                <RightOutlined
                  className={cn('shrink-0', checkDisabled ? 'cursor-not-allowed text-gray-700' : 'cursor-pointer')}
                  onClick={() => handleDateClick('next')}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="py-4">
          <table className="w-full table-fixed text-center">
            <thead>
              <tr>
                <td className="h-12">S</td>
                <td className="h-12">M</td>
                <td className="h-12">T</td>
                <td className="h-12">W</td>
                <td className="h-12">T</td>
                <td className="h-12">F</td>
                <td className="h-12">S</td>
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((item) => (
                <tr key={item}>
                  {dateArray.slice(item * 7, (item + 1) * 7).map((obj) => (
                    <td className="items-center justify-center text-center text-base font-bold" key={obj.key}>
                      <div className="flex h-12 items-center justify-center">
                        {obj.isCheckedin ? (
                          <div className="flex size-[40px] items-center justify-center rounded-full bg-[#3D3D4D]">
                            <object type="image/svg+xml" data={checkinNeonIcon} />
                          </div>
                        ) : obj.isToday ? (
                          <img
                            onClick={handleCheckIn}
                            className="inline-block size-[54px] cursor-pointer"
                            src={checkinIcon}
                            alt="Check in"
                          />
                        ) : (
                          obj.value
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Spin>
    </div>
  )
}
