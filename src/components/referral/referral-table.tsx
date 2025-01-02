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
    <div className="mt-4 flex min-h-[372px] w-full rounded-3xl bg-white/5 p-6">
      <div className="mr-[83px]">
        <h4 className="text-base font-semibold">Rewards</h4>
        <div className="mt-4">
          <span className="mr-[6px] text-4xl font-medium">{totalReward}</span>
          <span className="text-xs">points</span>
        </div>
      </div>
      <div className="flex-1 leading-[40px]">
        <h4 className="text-base font-semibold">History</h4>
        <div>
          <Row gutter={16} className="mt-[17px] h-[40px] text-sm font-medium leading-[40px]">
            <Col span={14}>Name</Col>
            <Col span={4} className="flex w-24 flex-none items-center justify-center text-center">
              Reward
            </Col>
            <Col span={6} className="w-[164px] flex-none text-right">
              Time
            </Col>
          </Row>
          <div className="max-h-[200px] overflow-y-auto pb-4">
            {list.length === 0 ? (
              <Empty />
            ) : (
              (loadingMore ? list.slice(0, defaultCount) : list).map((item, index) => (
                <Row
                  key={item.user_id}
                  gutter={16}
                  className="flex w-full items-center border-b border-solid border-[#300040]/5 text-sm leading-[40px]"
                >
                  <Col className="flex flex-1 flex-wrap">
                    <span className="inline-block">{index + 1}.</span>
                    {item.email || item.address}
                  </Col>
                  <Col className="flex w-24 flex-none items-center justify-center">
                    <div className="h-[22px] rounded-2xl bg-primary/25 px-2 text-xs font-medium leading-[22px] text-primary">
                      {item.reward} points
                    </div>
                  </Col>
                  <Col className="w-[164px] flex-none text-right">{dayjs(item.date).format('YYYY-MM-DD')}</Col>
                </Row>
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
