import { Button, Pagination, Tooltip } from 'antd'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { maskAddress } from '@/utils/wallet-address'
import TokenSettleClaimModal from '@/components/settings/token-settle-claim-modal'

// Mock Data Types
interface LockUpRecord {
  id: string
  source: string
  lockTime: string
  unlockTime: string
  txHash: string
  amount: number
  tokenType: 'USDT' | 'XNY'
  status: 'Locked' | 'Unlocked & settled' | 'Unlocked'
  timeLeft?: string
}

// Mock Data
const MOCK_DATA: LockUpRecord[] = [
  {
    id: '1',
    source: 'Activity / Airdrop name',
    lockTime: '2023-10-01 12:00',
    unlockTime: '2024-01-01 12:00',
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    amount: 100,
    tokenType: 'USDT',
    status: 'Locked',
    timeLeft: '35 days left'
  },
  {
    id: '2',
    source: 'Activity / Airdrop name',
    lockTime: '2023-09-15 10:30',
    unlockTime: '2023-12-15 10:30',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: 500,
    tokenType: 'USDT',
    status: 'Unlocked & settled'
  },
  {
    id: '3',
    source: 'Activity / Airdrop name',
    lockTime: '2023-08-20 14:15',
    unlockTime: '2023-11-20 14:15',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcd',
    amount: 200,
    tokenType: 'USDT',
    status: 'Unlocked'
  }
]

const STATUS_CONFIG = {
  Locked: { color: '#FFA800', label: (item: LockUpRecord) => `Locked · ${item.timeLeft}` },
  'Unlocked & settled': { color: '#BBBBBE', label: () => 'Unlocked & settled' },
  Unlocked: { color: '#5DDD22', label: () => 'Unlocked' }
}

function LockUpItem({ item }: { item: LockUpRecord }) {
  const statusConfig = STATUS_CONFIG[item.status]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/5 p-6 text-sm">
      {/* Header */}
      <div className="text-base font-bold text-white">
        {item.tokenType} · from {item.source}
      </div>

      <div className="grid grid-cols-1 gap-4 text-[#BBBBBE] lg:grid-cols-[auto_auto_auto_auto_1fr] lg:items-center lg:gap-12">
        {/* Lock Time */}
        <div className="flex gap-2">
          <span>Lock Time:</span>
          <span className="text-white">{item.lockTime}</span>
        </div>

        {/* Unlock Time */}
        <div className="flex gap-2">
          <span>Unlock Time:</span>
          <span className="text-white">{item.unlockTime}</span>
        </div>

        {/* Tx */}
        <div className="flex items-center gap-2">
          <span>Tx:</span>
          <div className="flex items-center gap-1">
            <Tooltip title={item.txHash}>
              <span className="text-white">{maskAddress(item.txHash)}</span>
            </Tooltip>
            <a
              href={`https://etherscan.io/tx/${item.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#875DFF] hover:text-[#A78BFA]"
            >
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>

        {/* Amount */}
        <div className="flex gap-2">
          <span>{item.tokenType}:</span>
          <span className="text-white">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Status */}
        <div className="flex justify-start lg:justify-end">
          <div className="rounded-full bg-[#FFFFFF0D] px-3 py-1.5 text-xs" style={{ color: statusConfig.color }}>
            {statusConfig.label(item)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LockUpClaim() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [showClaimModal, setShowClaimModal] = useState(false)

  // Mock Summary Data
  const summary = {
    usdt: { lockUp: 2000, ready: 1000 },
    xny: { lockUp: 2000, ready: 1000 }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between gap-6 rounded-2xl bg-[#252532] px-4 py-6">
        <div className="flex gap-6">
          {/* USDT Stats */}
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
            <span className="text-base font-bold text-white">USDT</span>
            <div className="flex gap-2 text-sm text-white/80">
              <span>In lock-up: {summary.usdt.lockUp.toLocaleString()}</span>
              <span>Ready to settle: {summary.usdt.ready.toLocaleString()}</span>
            </div>
          </div>

          {/* Divider for desktop */}
          <div className="h-6 w-px bg-white/10" />

          {/* XNY Stats */}
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
            <span className="text-base font-bold text-white">XNY</span>
            <div className="flex gap-2 text-sm text-white/80">
              <span>In lock-up: {summary.xny.lockUp.toLocaleString()}</span>
              <span>Ready to settle: {summary.xny.ready.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          className="h-9 rounded-full bg-[#875DFF] px-6 text-sm hover:bg-[#754DEB]"
          onClick={() => setShowClaimModal(true)}
        >
          Claim All
        </Button>
      </div>

      {/* List Items */}
      <div className="flex flex-col gap-4">
        {MOCK_DATA.map((item) => (
          <LockUpItem key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        className="mt-2"
        align="center"
        hideOnSinglePage
        defaultCurrent={1}
        current={page}
        pageSize={pageSize}
        onChange={(p) => setPage(p)}
        total={20} // Mock total
        showSizeChanger={false}
      />

      <TokenSettleClaimModal open={showClaimModal} onClose={() => setShowClaimModal(false)} />
    </div>
  )
}
