import { useMemo, useEffect } from 'react'
import { Spin, List, Pagination } from 'antd'
import dayjs from 'dayjs'

import Empty from '@/components/common/empty'

import { useUserStore } from '@/stores/user.store'
import { RewardStoreActions, useRewardStore } from '@/stores/reward.store'

const RewardTipMap = new Map<string, string>()
RewardTipMap.set(
  'EXTERNAL_airdrop-point-deduct-season-1',
  'Codatta Points deducted for claiming the XNY token airdrop.'
)

export default function UserInfoReward() {
  const { info } = useUserStore()
  const reward = useMemo(
    () =>
      info?.user_assets.find((asset) => asset.asset_type === 'POINTS')?.balance ?? { amount: '0', currency: 'POINTS' },
    [info]
  )

  return (
    <div>
      <h3 className="mb-6 flex items-center justify-between text-[32px] font-bold leading-[48px]">
        <span>Reward</span>
        <div>
          <span className="text-xl font-bold">{parseInt(reward.amount)}</span>
          <span className="text-sm">{reward.currency}</span>
        </div>
      </h3>
      <RewardRecords />
    </div>
  )
}

export function RewardRecords() {
  const { rewards, total_count, loading, pageSize } = useRewardStore()

  const onChange = (page: number) => {
    RewardStoreActions.reloadRewards(page)
  }

  useEffect(() => {
    RewardStoreActions.reloadRewards()
  }, [])

  return (
    <Spin spinning={loading}>
      <div>
        {rewards?.length > 0 ? (
          <List
            bordered
            dataSource={rewards.slice()}
            renderItem={(item) => (
              <List.Item>
                <div className="flex w-full flex-col py-3">
                  <div className="flex items-center gap-1.5 leading-5">
                    {/* <NetworkIcon type={item.network} size={16} /> */}
                    <div className="flex flex-col gap-1 text-base">
                      <div>{dayjs(item.create_at * 1000).format('YYYY/MM/DD HH:mm:ss')}</div>
                      <div className="text-sm text-white/40">{RewardTipMap.get(`${item.stage}_${item.task_id}`)}</div>
                    </div>
                    <div className="ml-auto text-base font-medium text-primary">
                      {parseInt(item.amount?.amount)} {item.amount?.currency}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div className="flex h-[calc(100vh_-_300px)] items-center justify-center">
            <Empty />
          </div>
        )}
      </div>

      <Pagination
        className="mt-6"
        align="center"
        hideOnSinglePage
        defaultCurrent={1}
        pageSize={pageSize}
        onChange={onChange}
        total={total_count}
        showSizeChanger={false}
      />
    </Spin>
  )
}
