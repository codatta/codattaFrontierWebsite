import { Button, Tabs, TabsProps } from 'antd'
import { useCodattaConnectContext } from 'codatta-connect'
import { formatEther } from 'viem'
import { Loader2 } from 'lucide-react'

import StakingIcon from '@/assets/settings/staking-icon.svg?react'

import CurrentStakingTab from '@/components/settings/staking-current'
import HistoryTab from '@/components/settings/staking-history'
import TokenStakeModal from '@/components/settings/token-stake-modal'

import StakingContract, { STAKE_ASSET_TYPE } from '@/contracts/staking.abi'
import { useContractRead } from '@/hooks/use-contract-read'
import { formatNumber } from '@/utils/str'
import { useState } from 'react'

export default function Staking() {
  const { lastUsedWallet } = useCodattaConnectContext()

  const { data: totalStakedRaw, loading } = useContractRead<bigint>({
    contract: StakingContract,
    functionName: 'userTotalStaked',
    args: [lastUsedWallet?.address],
    enabled: !!lastUsedWallet?.address
  })

  const totalStaked = totalStakedRaw ? formatEther(totalStakedRaw) : '0'

  const items: TabsProps['items'] = [
    {
      key: 'current',
      label: 'Current staking',
      children: <CurrentStakingTab />
    },
    {
      key: 'history',
      label: 'History',
      children: <HistoryTab />
    }
  ]

  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const handleStakeSuccess = () => {
    setStakeModalOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Staking</h3>
      <p className="text-sm text-[#BBBBBE]">
        Staked {STAKE_ASSET_TYPE} is only used as a signal in your reputation progress. No fixed yield or APR in this
        version. Unstaking requires a 7-day unlocking period.
      </p>

      {/* Summary Card */}
      <div className="mb-8 mt-12 flex items-center justify-between rounded-2xl bg-[#252532] p-6">
        <div className="flex items-center font-bold uppercase">
          <StakingIcon className="size-12" />
          <div className="ml-4 mr-6 text-base">TOTAL STAKED</div>
          <div className="text-xl">
            {loading ? (
              <Loader2 className="animate-spin text-[#875DFF]" size={24} />
            ) : (
              <>
                {formatNumber(Number(totalStaked), 2)} {STAKE_ASSET_TYPE}
              </>
            )}
          </div>
        </div>
        <Button
          type="primary"
          className="h-[38px] rounded-full bg-[#875DFF] px-4 text-sm"
          onClick={() => setStakeModalOpen(true)}
        >
          Stake {STAKE_ASSET_TYPE}
        </Button>
      </div>

      {/* Tabs and Content */}
      <Tabs
        defaultActiveKey="current"
        items={items}
        className="[&.ant-tabs-top>.ant-tabs-nav::before]:hidden [&_.ant-tabs-ink-bar]:bg-[#875DFF] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#875DFF] [&_.ant-tabs-tab-btn]:text-base"
      />
      {stakeModalOpen && (
        <TokenStakeModal
          open={true}
          onClose={() => setStakeModalOpen(false)}
          onSuccess={handleStakeSuccess}
          taskStakeConfig={{ stake_asset_type: 'XnYCoin' }}
        />
      )}
    </div>
  )
}
