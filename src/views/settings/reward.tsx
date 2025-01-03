import { useEffect, useState } from 'react'
import { Spin, List, Pagination } from 'antd'
import Empty from '@/components/common/empty'
import dayjs from 'dayjs'

import { RewardStoreActions, useRewardStore } from '@/stores/reward.store'
import UserApi from '@/apis/user.api'

export default function SettingsReward() {
  const { rewards, total_count, loading, pageSize } = useRewardStore()
  const [rewardDesc, setRewardDesc] = useState({
    amount: '',
    currency: ''
  })

  const onChange = (page: number) => {
    RewardStoreActions.reloadRewards(page)
  }

  useEffect(() => {
    RewardStoreActions.reloadRewards()
    try {
      UserApi.getUserInfo().then((res) => {
        const data = res?.data.user_assets?.filter((item) => item?.asset_type === 'POINTS')

        if (data[0]) {
          setRewardDesc(data[0].balance)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <div className="w-full px-6">
      <div className="mb-6">
        <span className="mr-1 text-sm font-semibold leading-[30px]">
          {rewardDesc?.amount ? parseInt(rewardDesc?.amount) : ''}
        </span>
        <span>{rewardDesc?.currency}</span>
      </div>
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
                      <div className="text-base">{dayjs(item.create_at * 1000).format('YYYY/MM/DD HH:mm:ss')}</div>
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
          size="small"
          hideOnSinglePage
          defaultCurrent={1}
          pageSize={pageSize}
          onChange={onChange}
          total={total_count}
          showSizeChanger={false}
        />
      </Spin>
    </div>
  )
}
