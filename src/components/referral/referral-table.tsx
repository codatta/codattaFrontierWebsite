import userApi, { InviteRecord } from '@/api-v1/user.api'
import Empty from '@/components/common/empty'
import { Button, Col, message, Row } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Table = () => {
  const defaultCount = 5
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalReward, setTotalReward] = useState(0)

  const [list, setList] = useState<InviteRecord[]>([])

  async function getData() {
    try {
      const { data } = await userApi.getInviteRecords()
      const list: InviteRecord[] = (data?.result || []).map((item) => {
        const date = dayjs(item.date)
        item.date = date.format('YYYY-MM-DD')
        return item
      })

      setTotalReward(data?.total_reward ?? 0)
      setList(list)

      if (list.length > defaultCount) {
        setLoadingMore(true)
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="mt-4 flex min-h-[372px] w-full flex-col gap-10 rounded-3xl bg-white/5 p-6 lg:flex-row lg:gap-10">
      <div className="">
        <h4 className="text-base font-semibold">Rewards</h4>
        <div className="mt-4">
          <span className="mr-[6px] text-4xl font-medium">{totalReward}</span>
          <span className="text-xs">points</span>
        </div>
      </div>
      <div className="flex-1 leading-[40px]">
        <h4 className="text-base font-semibold">History</h4>
        <div>
          <div className="mb-4 mt-[17px] flex text-sm font-medium">
            <div>Name</div>
            <div className="ml-auto flex w-24 flex-none items-center justify-center text-center">Reward</div>
            <div className="hidden w-[80px] text-right md:block">Time</div>
          </div>
          <div className="no-scrollbar max-h-[200px] overflow-y-auto pb-4">
            {list.length === 0 ? (
              <Empty />
            ) : (
              (loadingMore ? list.slice(0, defaultCount) : list).map((item, index) => (
                <div
                  key={item.user_id}
                  className="mb-4 flex items-center gap-4 border-b border-solid border-[#300040]/5 text-sm"
                >
                  <div className="line-clamp-1 flex flex-col flex-wrap gap-1">
                    <span>{item.email || item.address}</span>
                    <span className="block text-xs text-white/40 md:hidden">
                      {dayjs(item.date).format('YYYY-MM-DD')}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center justify-center">
                    <div className="h-[22px] whitespace-nowrap rounded-2xl bg-primary/25 px-2 text-xs font-medium leading-[22px] text-primary">
                      {item.reward} points
                    </div>
                  </div>
                  <div className="line-clamp-1 hidden w-[80px] text-right md:block">
                    {dayjs(item.date).format('YYYY-MM-DD')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-[17px] flex justify-center">
          {loadingMore && <Button onClick={() => setLoadingMore(false)}>Load more</Button>}
        </div>
      </div>
    </div>
  )
}

export default Table
