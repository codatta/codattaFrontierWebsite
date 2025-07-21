import { Button, message, Tabs, TabsProps } from 'antd'
import { useMemo, useState } from 'react'
import { ChevronUp } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

import { useUserStore } from '@/stores/user.store'
import { formatNumber } from '@/utils/str'
import { cn } from '@udecode/cn'

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
    children: <EmptyHistory />
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

// function EarnedHistory() {
//   return <div className="h-[calc(100vh-600px)] bg-[red]">EarnedHistory</div>
// }

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
