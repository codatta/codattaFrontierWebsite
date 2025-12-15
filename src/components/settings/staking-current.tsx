import { Button, TableProps } from 'antd'
import { ExternalLink } from 'lucide-react'
import StakingTable from './staking-table'

interface CurrentStakingItem {
  key: string
  amount: string
  stakedAt: string
  unlockTime: string
  status: string
  tx: string
  active: boolean
}

// Mock Data for Current Staking
const currentStakingData: CurrentStakingItem[] = [
  {
    key: '1',
    amount: '5,000 XNY',
    stakedAt: '2025-11-20 14:32',
    unlockTime: '2025-11-20 14:32',
    status: 'Unstaking',
    tx: '0x9fA1...1234',
    active: false
  },
  {
    key: '2',
    amount: '5,000 XNY',
    stakedAt: '2025-11-20 14:32',
    unlockTime: '-',
    status: 'Staked',
    tx: '0x9fA1...1234',
    active: true
  },
  {
    key: '3',
    amount: '5,000 XNY',
    stakedAt: '2025-11-20 14:32',
    unlockTime: '-',
    status: 'Staked',
    tx: '0x9fA1...1234',
    active: true
  }
]

export default function CurrentStakingTab() {
  const columns: TableProps<CurrentStakingItem>['columns'] = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%'
    },
    {
      title: 'Staked at',
      dataIndex: 'stakedAt',
      key: 'stakedAt',
      width: '20%'
    },
    {
      title: 'Unlock time',
      dataIndex: 'unlockTime',
      key: 'unlockTime',
      width: '20%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <div className="flex h-[26px] w-[84px] items-center justify-center rounded-full border border-[#FFFFFF1F] text-xs text-[#BBBBBE]">
          {status}
        </div>
      )
    },
    {
      title: 'Tx',
      dataIndex: 'tx',
      key: 'tx',
      width: '20%',
      render: (tx: string) => (
        <a href="#" className="flex items-center gap-1 text-base text-[#875DFF] hover:underline">
          TX:{tx} <ExternalLink size={24} />
        </a>
      )
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active: boolean) =>
        active ? (
          <Button type="text" className="h-[38px] w-[88px] rounded-full text-[#875DFF]">
            Unstake
          </Button>
        ) : (
          <div className="flex items-center justify-center text-[#BBBBBE]">-</div>
        )
    }
  ]

  return (
    <>
      <div className="mb-3 flex items-center justify-between rounded-xl bg-[#875DFF]/10 px-6 py-5 text-base">
        <div>
          <span className="text-white">2 claimable positions</span>
          <span className="mx-2 text-[#BBBBBE]">·</span>
          total <span className="text-[#875DFF]">12,000</span> XNY
        </div>
        <Button className="h-[32px] rounded-full border border-[#875DFF] bg-transparent text-sm text-[#875DFF] hover:!border-white hover:!text-white">
          Claim All
        </Button>
      </div>

      {/* Table */}
      <StakingTable<CurrentStakingItem> columns={columns} dataSource={currentStakingData} />
    </>
  )
}
