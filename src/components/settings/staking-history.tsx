import { TableProps } from 'antd'
import { ExternalLink } from 'lucide-react'
import StakingTable from './staking-table'

interface HistoryItem {
  key: string
  time: string
  amount: string
  status: string
  tx: string
}

// Mock Data for History
const historyData: HistoryItem[] = [
  {
    key: '1',
    time: '2025-11-20 14:32',
    amount: '5,000 XNY',
    status: 'Unlocked',
    tx: '0x9fA1...1234'
  },
  {
    key: '2',
    time: '2025-11-20 14:32',
    amount: '5,000 XNY',
    status: 'Unlocked',
    tx: '0x9fA1...1234'
  },
  {
    key: '3',
    time: '2025-11-20 14:32',
    amount: '5,000 XNY',
    status: 'Unlocked',
    tx: '0x9fA1...1234'
  },
  {
    key: '4',
    time: '2025-11-20 14:32',
    amount: '5,000 XNY',
    status: 'Unlocked',
    tx: '0x9fA1...1234'
  }
]

export default function HistoryTab() {
  const columns: TableProps<HistoryItem>['columns'] = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: '25%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '25%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (status: string) => (
        <div className="flex w-[88px] items-center justify-center rounded-full border border-[#FFFFFF1F] py-1 text-sm text-[#BBBBBE]">
          {status}
        </div>
      )
    },
    {
      title: 'Tx',
      dataIndex: 'tx',
      key: 'tx',
      width: '25%',
      render: (tx: string) => (
        <a href="#" className="flex items-center gap-1 pl-4 text-[#875DFF] hover:underline">
          TX:{tx} <ExternalLink size={24} />
        </a>
      )
    }
  ]

  return (
    <div>
      <StakingTable<HistoryItem> columns={columns} dataSource={historyData} />
    </div>
  )
}
