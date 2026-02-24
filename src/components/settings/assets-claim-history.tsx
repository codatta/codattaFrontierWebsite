import userApi, { RewardRecordHistoryItem } from '@/apis/user.api'
import { message, Pagination, Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { maskAddress } from '@/utils/format'

const statusColorMap = new Map<string, string>([
  ['Success', '#5DDD22'],
  ['Pending', '#FFA800'],
  ['Failed', '#D92B2B'],
  ['Canceled', '#ffffff30'],
  ['Not Started', '#ffffff30']
])

function ClaimHistoryItem({ item }: { item: RewardRecordHistoryItem }) {
  const claimTimeDate = item.gmt_create?.split('.')[0]
  const claimTime = dayjs(claimTimeDate).format('YYYY-MM-DD HH:mm')

  return (
    <div className="items-center gap-2 rounded-xl border border-white/5 p-6 lg:flex">
      <div>
        <div className="mb-3 text-base font-bold lg:mb-1">{claimTime}</div>
        <div className="mb-4 flex flex-col gap-1 text-white/60 md:flex-row md:gap-3 lg:mb-0">
          {item.tx_hash && (
            <div>
              TxHash:{' '}
              <Tooltip title={item.tx_hash}>
                <span className="text-white">{maskAddress(item.tx_hash, 6)}</span>
              </Tooltip>
            </div>
          )}
          <div>
            ID: <span className="text-white">{item.uid}</span>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center gap-3 lg:ml-auto lg:w-auto">
        <div className="flex items-center gap-2" style={{ color: statusColorMap.get(item.status_name) }}>
          <div className="size-1.5 rounded-full" style={{ backgroundColor: statusColorMap.get(item.status_name) }} />
          {item.status_name}
        </div>
        <div className="ml-auto min-w-[160px] rounded-full bg-primary/20 px-4 py-1 text-center text-primary lg:ml-0">
          {item.asset_type == 'XnYCoin' ? 'XNY' : item.asset_type} <strong>+{item.balance.toFixed(6)}</strong>
        </div>
      </div>
    </div>
  )
}

export default function ClaimHistory() {
  const [rewardRecordHistory, setRewardRecordHistory] = useState<RewardRecordHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  async function getRewardRecordHistory(page: number, pageSize: number) {
    setLoading(true)
    try {
      const res = await userApi.getRewardRecordHistory(page, pageSize)
      setTotal(res.count)
      setRewardRecordHistory(res.list)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRewardRecordHistory(page, pageSize)
  }, [page, pageSize])

  return (
    <div className="">
      <Spin spinning={loading}>
        {rewardRecordHistory?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {rewardRecordHistory.map((item) => (
                <ClaimHistoryItem item={item} key={item.uid} />
              ))}
            </div>

            <Pagination
              className="mt-6"
              align="center"
              hideOnSinglePage
              defaultCurrent={1}
              current={page}
              pageSize={pageSize}
              onChange={(page) => setPage(page)}
              total={total}
              showSizeChanger={false}
            />
          </>
        ) : (
          <EmptyHistory />
        )}
      </Spin>
    </div>
  )
}

function EmptyHistory() {
  return (
    <div className="flex h-[calc(100vh-600px)] items-center justify-center text-sm">
      No relevant historical records available.
    </div>
  )
}
