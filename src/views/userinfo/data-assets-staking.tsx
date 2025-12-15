import { Button, Tabs, TabsProps } from 'antd'

import StakingIcon from '@/assets/settings/staking-icon.svg?react'

import CurrentStakingTab from '@/components/settings/staking-current'
import HistoryTab from '@/components/settings/staking-history'

export default function Staking() {
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

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Staking</h3>
      <p className="text-sm text-[#BBBBBE]">
        Staked XNY is only used as a signal in your reputation progress. No fixed yield or APR in this version.
        Unstaking requires a 7-day unlocking period.
      </p>

      {/* Summary Card */}
      <div className="mb-8 mt-12 flex items-center justify-between rounded-2xl bg-[#252532] p-6">
        <div className="flex items-center font-bold uppercase">
          <StakingIcon className="size-12" />
          <div className="ml-4 mr-6 text-base">TOTAL STAKED</div>
          <div className="text-xl">612,000 XNY</div>
        </div>
        <Button type="primary" className="h-[38px] rounded-full bg-[#875DFF] px-4 text-sm">
          Stake XNY
        </Button>
      </div>

      {/* Tabs and Content */}
      <Tabs
        defaultActiveKey="current"
        items={items}
        className="[&.ant-tabs-top>.ant-tabs-nav::before]:hidden [&_.ant-tabs-ink-bar]:bg-[#875DFF] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-semibold [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#875DFF] [&_.ant-tabs-tab-btn]:text-base"
      />
    </div>
  )
}
