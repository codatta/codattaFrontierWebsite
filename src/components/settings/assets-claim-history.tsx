import userApi, { RewardRecordHistoryItem } from '@/apis/user.api'
import { message, Pagination, Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { maskAddress } from '@/utils/format'
import { useSearchParams } from 'react-router-dom'

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
          {item.to_address && (
            <div>
              Receiving Address:{' '}
              <Tooltip title={item.to_address}>
                <span className="text-white">{maskAddress(item.to_address, 6)}</span>
              </Tooltip>
            </div>
          )}
          <div>
            ID: <span className="text-white">{item.uid}</span>
          </div>
        </div>
      </div>
      <div className="ml-auto text-right">
        <div className="mb-3 text-base font-bold lg:mb-1">
          {item.balance} {item.asset_type === 'USDT' ? 'USDT' : 'XNY'}
        </div>
        <div className="flex items-center justify-end gap-1">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: statusColorMap.get(item.status_name) || '#ffffff30' }}
          ></div>
          <div className="text-sm font-medium" style={{ color: statusColorMap.get(item.status_name) || '#ffffff30' }}>
            {item.status_name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClaimHistory() {
  const [searchParams] = useSearchParams()
  const [rewardRecordHistory, setRewardRecordHistory] = useState<RewardRecordHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const refreshTime = searchParams.get('t')

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
  }, [page, pageSize, refreshTime])

  return (
    <div className="">
      <Spin spinning={loading}>
        {rewardRecordHistory?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              {rewardRecordHistory.map((item) => (
                <ClaimHistoryItem key={item.uid} item={item} />
              ))}
            </div>
            <div className="mt-8 flex justify-center pb-20">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={(page) => setPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <div className="py-[120px] text-center text-[#8D8D93]">No Assets Available</div>
        )}
      </Spin>
    </div>
  )
}
