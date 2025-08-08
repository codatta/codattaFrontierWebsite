import { Button, message, Tabs, TabsProps, Spin, List, Pagination } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { ChevronUp } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

import { useUserStore } from '@/stores/user.store'
import { formatNumber } from '@/utils/str'
import { cn } from '@udecode/cn'
import userApi, { FrontierTokenRewardItem } from '@/apis/user.api'
// import { RewardsDesc } from '@/apis/rewards.api'

export default function DataAssets() {
  const handleClaim = () => {
    message.info('Coming soon!')
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h3 className="mb-6 text-[32px] font-bold leading-[48px]">Token Rewards</h3>
          <p className="text-sm text-[#BBBBBE]">Claim and manage your earned tokens from data submissions</p>
        </div>
        <Button type="primary" className="h-[38px] rounded-full text-sm leading-[36px]" onClick={handleClaim}>
          Claim Rewards
        </Button>
      </div>
      <TokenRewards />
      <History />
    </div>
  )
}

function TokenRewards() {
  const { info } = useUserStore()
  const [expanded, setExpanded] = useState(true)

  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XnYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const xynAmount = formatNumber(Number(xyn?.amount ?? 0.0))
    const usdtAmount = formatNumber(Number(usdt?.amount ?? 0.0))

    return [
      {
        type: 'XNY',
        amount: xynAmount === '0' ? '0.00' : xynAmount,
        currency: xyn?.currency ?? 'XNY Token',
        Icon: <XnyIcon />
      },
      {
        type: 'USDT',
        amount: usdtAmount === '0' ? '0.00' : usdtAmount,
        currency: usdt?.currency ?? 'USDT',
        Icon: <USDTIcon />
      }
    ]
  }, [info])

  return (
    <div className="mb-6 rounded-xl bg-[#252532] px-4 py-3">
      <header className="flex items-center justify-between text-base font-semibold">
        <span>💴 Your Assets Overview</span>
        <ChevronUp
          onClick={() => setExpanded(!expanded)}
          className={cn('cursor-pointer transition-all', expanded ? 'rotate-0' : 'rotate-180')}
        />
      </header>

      <ul
        className={cn(
          'mt-3 grid grid-cols-1 gap-5 overflow-hidden transition-all md:grid-cols-2 xl:grid-cols-3',
          expanded ? 'h-auto' : 'h-0'
        )}
      >
        {assets.map((asset) => (
          <li key={asset.type} className="flex items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6">
            {asset.Icon}
            <div className="text-right">
              <div className="mb-1 text-[28px] font-bold">{asset.amount}</div>
              <div className="text-base text-[#BBBBBE]">{asset.type}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const items: TabsProps['items'] = [
  {
    key: 'earned-history-tab',
    label: 'Earned History',
    children: <EarnedHistory />
  },
  {
    key: 'claim-history-tab',
    label: 'Claim History',
    children: <EmptyHistory />
  }
]

function History() {
  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      onChange={onChange}
      className="flex-1 [&.ant-tabs-top>.ant-tabs-nav::before]:hidden"
    />
  )
}

function EarnedHistory() {
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
        size="small"
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

// function ClaimHistory() {
//   return <div className="h-[calc(100vh-400px)] bg-[blue]">ClaimHistory</div>
// }

function EmptyHistory() {
  return (
    <div className="flex h-[calc(100vh-600px)] items-center justify-center text-sm">
      No relevant historical records available.
    </div>
  )
}
