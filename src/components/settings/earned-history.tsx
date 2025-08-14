import userApi, { FrontierTokenRewardItem } from '@/apis/user.api'
import { List, message, Pagination, Spin } from 'antd'
import { useEffect, useState } from 'react'

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
            renderItem={(item) => (
              <List.Item className="p-0">
                <div className="w-full rounded-2xl border border-[#FFFFFF1F] p-6 md:flex">
                  <div>
                    <div className="mb-2 text-base font-bold">{item.frontier_name}</div>
                    <div className="text-sm text-[#BBBBBE]">
                      Total Submission Count: <span className="mr-3 font-bold text-white">{item.total_submission}</span>
                      Average Submission Score: <span className="font-bold text-white">{item.average_rating_name}</span>
                    </div>
                  </div>
                  <ul className="mt-2 flex gap-4 md:ml-auto md:mt-0 md:block">
                    {item.tokens.map((asset) => (
                      <li key={asset.reward_type} className="flex items-center justify-end gap-2 text-sm">
                        <span>{asset.reward_type}</span>
                        <span className="font-semibold text-[#875DFF]">+{asset.reward_amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </List.Item>
            )}
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
