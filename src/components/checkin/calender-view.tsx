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

// Types
interface TCheckInType {
  chain: string
  icon: string
  name: string
}

interface TCheckInHistoryItem {
  check_in_date: string
}

interface TCheckInHistoryResponse {
  history: TCheckInHistoryItem[]
  check_count: number
}

interface TCalendarCell {
  key: string
  value: number | null
  isCheckedin?: boolean
  isToday?: boolean
}

// Constants
const CHECK_IN_CHAINS: TCheckInType[] = [
  { chain: 'Codatta', icon: 'https://static.codatta.io/static/favicon.svg', name: 'Codatta' }
]

export default function CalenderView({ className = '' }: { className?: string }) {
  // State
  const [dateArray, setDateArray] = useState<TCalendarCell[]>([])
  const [checkinHistory, setCheckinHistory] = useState<string[]>([])
  const [totalCheckinCount, setTotalCheckinCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedTCheckInType, setSelectedTCheckInType] = useState<TCheckInType>(CHECK_IN_CHAINS[0])
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().utc())
  const [calendarRows, setCalendarRows] = useState<number[]>([])

  // Computed
  const checkDisabled = useMemo(() => selectedDate.startOf('month') >= dayjs().startOf('month'), [selectedDate])

  const CheckInMenu = useMemo(
    () =>
      CHECK_IN_CHAINS.map((item) => ({
        key: item.chain,
        label: (
          <div className="flex items-center gap-2 py-1" onClick={() => setSelectedTCheckInType(item)}>
            <img className="size-[22px] rounded-full" src={item.icon} alt={item.name} />
            <span>{item.name}</span>
          </div>
        )
      })),
    []
  )

  // Handlers
  const handleDateClick = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      setSelectedDate((prev) => prev.add(-1, 'month'))
    } else if (type === 'next' && !checkDisabled) {
      setSelectedDate((prev) => prev.add(1, 'month'))
    }
  }

  const handleCheckIn = async () => {
    if (selectedTCheckInType.chain === 'Codatta') {
      setLoading(true)
      try {
        await taskApi.updateCheckin()
        await getCheckinHistory(selectedTCheckInType, selectedDate)
      } catch (err: unknown) {
        message.error(err instanceof Error ? err.message : 'Check in failed')
      }
      setLoading(false)
    }
  }

  // API Calls
  const getCheckinHistory = async (TcheckInType: TCheckInType, date: Dayjs) => {
    setLoading(true)
    try {
      const month = date.utc().month() + 1
      const year = date.utc().year()
      const res = (await taskApi.getCheckHistory(TcheckInType.chain, year, month)) as TCheckInHistoryResponse

      setTotalCheckinCount(res.check_count)
      setCheckinHistory(res.history.map((item) => item.check_in_date))
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

  // Effects
  useEffect(() => {
    getCheckinHistory(selectedTCheckInType, selectedDate)
  }, [selectedTCheckInType, selectedDate])

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

              {/* <Dropdown menu={{ items: CheckInMenu }} trigger={['click']}>
                <div className="flex h-9 w-[160px] cursor-pointer items-center gap-2 rounded-[36px] bg-white px-3 py-[6px] text-base text-gray">
                  <img
                    className="size-[22px] rounded-full"
                    src={selectedTCheckInType.icon}
                    alt={selectedTCheckInType.name}
                  />
                  <span>{selectedTCheckInType.name}</span>
                  <DownOutlined className="ml-auto" />
                </div>
              </Dropdown> */}
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
