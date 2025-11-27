import userApi, { LockupTokenRewardItem } from '@/apis/user.api'
import { List, message, Pagination, Spin } from 'antd'
import { useEffect, useState } from 'react'

export default function EarnedHistory() {
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<LockupTokenRewardItem[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  async function getRewards(page: number, pageSize: number) {
    setLoading(true)
    try {
      const res = await userApi.getLockupTokenReward(page, pageSize)
      console.log('getLockupTokenReward', res)
      setRewards(res.data.list || [])
      setTotal(res.data.count || 0)
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
                      <div className="mb-2 text-base font-bold">{item.name}</div>
                      <div className="text-sm text-[#BBBBBE]">
                        {
                          <>
                            Total Submission: <span className="mr-3 font-bold text-white">{item.total_submission}</span>
                          </>
                        }

                        {item.average_rating_name && (
                          <>
                            Average Score: <span className="font-bold text-white">{item.average_rating_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{item.reward_type == 'XnYCoin' ? 'XNY' : item.reward_type}</span>
                      <span className="font-semibold text-[#875DFF]">
                        +{Number(item.reward_amount).toLocaleString()}
                      </span>
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
