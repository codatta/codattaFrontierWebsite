import userApi, { FrontierTokenRewardItem } from '@/apis/user.api'
import { List, message, Pagination, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const mockRewards: FrontierTokenRewardItem[] = [
  {
    frontier_id: 'frontier_1',
    frontier_name: 'AI Research Dataset Labeling',
    total_submission: 24,
    average_rating_name: 'Excellent',
    average_result: 4.8,
    tokens: [
      {
        frontier_id: 'frontier_1',
        reward_type: 'XnYCoin',
        reward_amount: 123.45,
        reward_locked_amount: 20,
        reward_unlock_time: '2025-12-01T00:00:00Z'
      },
      {
        frontier_id: 'frontier_1',
        reward_type: 'USDT',
        reward_amount: 25,
        reward_locked_amount: 4,
        reward_unlock_time: '2025-12-01T00:00:00Z'
      }
    ]
  },
  {
    frontier_id: 'frontier_2',
    frontier_name: 'DeFi User Behavior Data',
    total_submission: 10,
    average_rating_name: 'Good',
    average_result: 4.1,
    tokens: [
      {
        frontier_id: 'frontier_2',
        reward_type: 'XnYCoin',
        reward_amount: 80,
        reward_locked_amount: 10,
        reward_unlock_time: '2025-11-30T00:00:00Z'
      }
    ]
  }
]
export default function EarnedHistory() {
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<FrontierTokenRewardItem[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  async function getRewards(page: number, pageSize: number) {
    setLoading(true)
    try {
      const res = await userApi.getFrontierTokenReward(page, pageSize)
      setRewards(res.data.list)
      setTotal(res.data.count)
      // setRewards(mockRewards)
      // setTotal(mockRewards.length)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRewards(page, pageSize)
  }, [page])

  return (
    <Spin spinning={loading}>
      <div>
        {rewards?.length > 0 ? (
          <List
            split={false}
            dataSource={rewards.slice()}
            renderItem={(item) => {
              return (
                <List.Item className="p-0">
                  <div className="flex w-full flex-col justify-between rounded-2xl border border-[#FFFFFF1F] p-6 md:flex-row">
                    <div className="mb-4 flex-1 md:mb-0">
                      <div className="mb-2 text-base font-bold">{item.frontier_name}</div>
                      <div className="text-sm text-[#BBBBBE]">
                        Total Submission Count:{' '}
                        <span className="mr-3 font-bold text-white">{item.total_submission}</span>
                        Average Submission Score:{' '}
                        <span className="font-bold text-white">{item.average_rating_name}</span>
                      </div>
                    </div>

                    <div className="flex min-w-[160px] flex-col items-end justify-center gap-3">
                      {item.tokens.map((asset) => (
                        <div key={asset.reward_type} className="flex flex-col items-end">
                          <div className="flex items-center gap-2 text-sm">
                            <span>{asset.reward_type == 'XnYCoin' ? 'XNY' : asset.reward_type}</span>
                            <span className="font-semibold text-[#875DFF]">
                              +{Number(asset.reward_amount).toLocaleString()}
                            </span>
                          </div>
                          {asset.reward_locked_amount > 0 && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-[#BBBBBE]">
                              <div>
                                Locked:{' '}
                                <span className="text-white">
                                  {Number(asset.reward_locked_amount).toLocaleString()}
                                </span>
                              </div>
                              <div className="mx-1">·</div>
                              <div>
                                Unlock:{' '}
                                <span className="text-white">
                                  {dayjs(asset.reward_unlock_time).format('YYYY-MM-DD HH:mm')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </List.Item>
              )
            }}
          />
        ) : (
          <EmptyHistory />
        )}
      </div>

      <Pagination
        className="mt-6"
        align="center"
        hideOnSinglePage
        defaultCurrent={1}
        pageSize={pageSize}
        onChange={(page) => setPage(page)}
        total={total}
        showSizeChanger={false}
      />
    </Spin>
  )
}

function EmptyHistory() {
  return (
    <div className="flex h-[calc(100vh-600px)] items-center justify-center text-sm">
      No relevant historical records available.
    </div>
  )
}
