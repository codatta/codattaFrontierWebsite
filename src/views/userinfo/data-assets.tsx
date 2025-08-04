import { Button, message, Tabs, TabsProps, Spin, List } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { ChevronUp } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

import { useUserStore } from '@/stores/user.store'
import { formatNumber } from '@/utils/str'
import { cn } from '@udecode/cn'
import TokenClaimModal from '@/components/settings/token-claim-modal'
// import { RewardsDesc } from '@/apis/rewards.api'

export default function DataAssets() {
  const [tokenClaimModalOpen, setTokenClaimModalOpen] = useState(false)

  const handleClaim = () => {
    setTokenClaimModalOpen(true)
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
      <TokenClaimModal open={tokenClaimModalOpen} onClose={() => setTokenClaimModalOpen(false)}></TokenClaimModal>
    </div>
  )
}

function TokenRewards() {
  const { info } = useUserStore()
  const [expanded, setExpanded] = useState(true)

  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XNYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const xynAmount = formatNumber(Number(xyn?.amount ?? 0.0))
    const usdtAmount = formatNumber(Number(usdt?.amount ?? 0.0))

    return [
      {
        type: 'XNYCoin',
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
          <li
            key={asset.currency}
            className="flex items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6"
          >
            {asset.Icon}
            <div className="text-right">
              <div className="mb-1 text-[28px] font-bold">{asset.amount}</div>
              <div className="text-base text-[#BBBBBE]">{asset.currency}</div>
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

type EarnedHistoryItem = {
  frontier_id: string
  frontier_name: string
  total_submission_count: number
  average_submission_score: string
  assets: {
    asset_id: string
    asset_type: string
    amount: {
      currency: string
      amount: string
    }
  }[]
}

function EarnedHistory() {
  const [loading, setLoading] = useState(false)
  const [rewards, setRewards] = useState<EarnedHistoryItem[]>([])

  useEffect(() => {
    setLoading(true)
    try {
      // const earnedHistory = [
      //   {
      //     frontier_id: '1',
      //     frontier_name: 'NFT Classification Frontier',
      //     total_submission_count: 10,
      //     average_submission_score: 'A',
      //     assets: [
      //       {
      //         asset_id: '1',
      //         asset_type: 'XNYCoin',
      //         amount: {
      //           currency: 'XNY Token',
      //           amount: '0.001'
      //         }
      //       },
      //       {
      //         asset_id: '2',
      //         asset_type: 'USDT',
      //         amount: {
      //           currency: 'USDT',
      //           amount: '2.00'
      //         }
      //       }
      //     ]
      //   },
      //   {
      //     frontier_id: '2',
      //     frontier_name: 'NFT Classification Frontier',
      //     total_submission_count: 20,
      //     average_submission_score: 'A',
      //     assets: [
      //       {
      //         asset_id: '1',
      //         asset_type: 'XNYCoin',
      //         amount: {
      //           currency: 'XNY Token',
      //           amount: '0.001'
      //         }
      //       },
      //       {
      //         asset_id: '2',
      //         asset_type: 'USDT',
      //         amount: {
      //           currency: 'USDT',
      //           amount: '20.00'
      //         }
      //       }
      //     ]
      //   }
      // ]
      setRewards([])
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }, [])

  return (
    <Spin spinning={loading}>
      <div>
        {rewards?.length > 0 ? (
          <List
            className="border-none"
            bordered
            dataSource={rewards.slice()}
            renderItem={(item) => (
              <List.Item className="mb-3 flex justify-between rounded-2xl border border-[#FFFFFF1F] p-6">
                <div>
                  <div className="mb-2 text-base font-bold">{item.frontier_name}</div>
                  <div className="text-sm text-[#BBBBBE]">
                    Total Submission Count:{' '}
                    <span className="mr-3 font-bold text-white">{item.total_submission_count}</span>
                    Average Submission Score:{' '}
                    <span className="font-bold text-white">{item.average_submission_score}</span>
                  </div>
                </div>
                <ul>
                  {item.assets.map((asset) => (
                    <li key={asset.asset_id} className="flex items-center justify-end gap-2 text-sm">
                      <span>{asset.amount.currency}</span>
                      <span className="font-semibold text-[#875DFF]">+{asset.amount.amount}</span>
                    </li>
                  ))}
                </ul>
              </List.Item>
            )}
          />
        ) : (
          <EmptyHistory />
        )}
      </div>

      {/* <Pagination
        className="mt-6"
        align="center"
        size="small"
        hideOnSinglePage
        defaultCurrent={1}
        pageSize={pageSize}
        onChange={onChange}
        total={total_count}
        showSizeChanger={false}
      /> */}
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
