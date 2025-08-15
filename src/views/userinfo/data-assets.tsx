import { Button, Tabs, TabsProps } from 'antd'
import { useMemo, useState } from 'react'
import { ChevronUp } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

import { useUserStore } from '@/stores/user.store'
import { cn } from '@udecode/cn'
import TokenClaimModal from '@/components/settings/token-claim-modal'
import ClaimHistory from '@/components/settings/assets-claim-history'
import EarnedHistory from '@/components/settings/earned-history'
import TokenClaimModalTest from '@/components/settings/token-claim-modal-test'

const items: TabsProps['items'] = [
  {
    key: 'earned-history-tab',
    label: 'Earned History',
    children: <EarnedHistory />
  },
  {
    key: 'claim-history-tab',
    label: 'Claim History',
    children: <ClaimHistory />
  }
]

export default function DataAssets() {
  const [showClaimModal, setShowClaimModal] = useState(false)
  // const [showClaimModalTest, setShowClaimModalTest] = useState(false)

  const handleClaim = () => {
    setShowClaimModal(true)
  }

  // const handleClaimTest = () => {
  //   setShowClaimModalTest(true)
  // }

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
        {/* <Button type="primary" className="h-[38px] rounded-full text-sm leading-[36px]" onClick={handleClaimTest}>
          Claim Rewards Test
        </Button> */}
      </div>
      <TokenRewards />
      <Tabs
        destroyOnHidden
        defaultActiveKey="1"
        items={items}
        className="flex-1 [&.ant-tabs-top>.ant-tabs-nav::before]:hidden"
      />
      <TokenClaimModal open={showClaimModal} onClose={() => setShowClaimModal(false)} />
      {/* <TokenClaimModalTest open={showClaimModalTest} onClose={() => setShowClaimModalTest(false)} /> */}
    </div>
  )
}

function TokenRewards() {
  const { info } = useUserStore()
  const [expanded, setExpanded] = useState(true)

  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XnYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const xynAmount = Number(xyn?.amount ?? 0.0).toFixed(2)
    const usdtAmount = Number(usdt?.amount ?? 0.0).toFixed(2)

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
