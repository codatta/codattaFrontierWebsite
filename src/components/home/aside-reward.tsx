import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Empty, List, Spin } from 'antd'
import dayjs from 'dayjs'

import { RewardStoreActions, useRewardStore } from '@/stores/reward.store'

export default function Reward() {
  const { rewards, total_count, loading } = useRewardStore()

  useEffect(() => {
    RewardStoreActions.reloadRewards()
  }, [])

  return (
    <div className="relative mt-5 flex flex-1 flex-col p-4 text-white">
      <Spin spinning={loading && !total_count} className="w-full">
        <div className="text-sm">
          <h3 className="text-base">Reward</h3>
          {rewards?.length > 0 ? (
            <>
              <List
                dataSource={rewards.slice()}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex w-full items-center justify-between gap-1.5 pb-4 pt-5 leading-5">
                      <div className="text-base">{dayjs(item.create_at * 1000).format('YYYY/MM/DD HH:mm:ss')}</div>
                      <div className="ml-auto font-semibold text-primary">
                        {parseInt(item.amount?.amount)} {item.amount?.currency}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
              <Link to="/app/settings/reward" className="mx-auto">
                View More
              </Link>
            </>
          ) : (
            <div className="mt-36">
              <Empty />
            </div>
          )}
        </div>
      </Spin>
    </div>
  )
}
