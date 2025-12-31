import { Button, TableProps, Spin, message, Table, Modal } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { useState, useMemo, ComponentProps, useEffect } from 'react'
import { formatEther } from 'viem'
import dayjs from 'dayjs'
import { cn } from '@udecode/cn'

import { formatNumber } from '@/utils/str'
import userApi from '@/apis/user.api'

import StakingContract, { STAKE_ASSET_TYPE } from '@/contracts/staking.abi'

import { useContractRead } from '@/hooks/use-contract-read'
import { useContractWrite } from '@/hooks/use-contract-write'
import { useCurrentWalletAddress } from '@/hooks/use-current-wallet-address'

interface StakingActionModalProps {
  open: boolean
  onClose: () => void
  type: 'unstake' | 'claim_success'
  amount: string
  symbol: string
  onConfirm?: () => void
  isLoading?: boolean
  onViewHistory?: () => void
}

function StakingActionModal({
  open,
  onClose,
  type,
  amount,
  symbol,
  onConfirm,
  isLoading,
  onViewHistory
}: StakingActionModalProps) {
  const isUnstake = type === 'unstake'

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closable={isUnstake ? !isLoading : true}
      maskClosable={isUnstake ? !isLoading : true}
      styles={{
        content: {
          padding: 0,
          backgroundColor: '#252532',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        },
        header: isUnstake
          ? {
              backgroundColor: 'transparent',
              marginBottom: 0,
              padding: '20px 24px'
            }
          : undefined,
        body: isUnstake
          ? {
              padding: '24px'
            }
          : undefined
      }}
      title={isUnstake ? <div className="text-lg font-bold text-white">Unstake {symbol}</div> : null}
    >
      {isUnstake ? (
        <>
          <div className="mb-12 rounded-xl bg-[#1C1C26] p-6">
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-white">Amount</span>
              <span className="text-[#FFA800]">
                <span className="font-bold">{formatNumber(Number(amount), 2)}</span> <span>{symbol}</span>
              </span>
            </div>
            <div className="my-3 h-px bg-[#FFFFFF1F]"></div>
            <ul className="list-outside list-disc space-y-2 pl-3 text-base text-[#BBBBBE]">
              <li>
                After you confirm, this stake will enter a 7-day unlocking period. During this time, it won’t be
                available for use and will not count toward your reputation requirement.
              </li>
              <li>When the unlocking period ends, the {symbol} will automatically return to your available balance.</li>
              <li>You can review this position later in Staking &gt; History.</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={onConfirm}
              loading={isLoading}
              className="h-10 rounded-full bg-[#875DFF] px-6 text-sm"
            >
              Confirm Unstake
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center px-6 py-12">
          <CheckCircleFilled className="mb-6 text-[64px] text-[#00C853]" />
          <div className="mb-2 text-2xl font-bold text-white">Claim completed</div>
          <div className="mb-8 max-w-[340px] text-center text-[#BBBBBE]">
            Once the transaction is confirmed on-chain (up to ~10 minutes),{' '}
            <span className="font-bold text-white">
              {formatNumber(Number(amount), 2)} {symbol}
            </span>{' '}
            will be returned to your wallet and appear in History.
          </div>

          <Button
            type="primary"
            onClick={onViewHistory}
            className="h-10 w-[200px] cursor-pointer rounded-full bg-[#875DFF] font-semibold hover:bg-[#754DEB]"
          >
            View History
          </Button>
        </div>
      )}
    </Modal>
  )
}

interface CurrentStakingItem {
  key: string
  amount: string
  stakedAt: string
  unlockTime: string
  status: string
  tx: string
  active: boolean
  rawAmount: bigint
}

interface PositionEntry {
  positionId: string
  amount: bigint
  startTime: bigint
  unlockTime: bigint
}

interface StakingTableProps<T> extends TableProps<T> {
  total?: number
  current?: number
  pageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

function StakingTable<T extends object>({
  columns,
  dataSource,
  total = 0,
  current = 1,
  pageSize = 10,
  onPageChange
}: StakingTableProps<T>) {
  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <Table
        locale={{ emptyText: <p className="py-10">You don't have any active staking positions yet.</p> }}
        className="[&_.ant-table-placeholder_.ant-empty-description]:text-[#BBBBBE] [&_.ant-table-placeholder_.ant-empty]:flex [&_.ant-table-placeholder_.ant-empty]:flex-col [&_.ant-table-placeholder_.ant-empty]:items-center [&_.ant-table-placeholder_.ant-table-cell]:!px-0 [&_.ant-table-placeholder_.ant-table-cell]:!text-center [&_.ant-table]:bg-transparent"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total,
          current,
          pageSize,
          onChange: onPageChange,
          position: ['bottomRight'],
          showSizeChanger: false,
          className:
            'mt-6 flex w-full items-center gap-x-2 [&_.ant-pagination-total-text]:mr-auto [&_.ant-pagination-item-active]:bg-[#40404b] [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-none [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:text-white/60 [&_.ant-pagination-item]:border-none [&_.ant-pagination-prev_button]:!text-white/60 [&_.ant-pagination-next_button]:!text-white/60',
          showTotal: (total) => <span className="text-[#BBBBBE]">{`Total ${total}`}</span>
        }}
        components={{
          table: ({ children, ...props }: ComponentProps<'table'>) => (
            <table {...props} className={`w-full border-collapse ${props.className || ''}`}>
              {children}
            </table>
          ),
          header: {
            wrapper: ({ children, ...props }: ComponentProps<'thead'>) => (
              <thead {...props} className={`bg-transparent ${props.className || ''}`}>
                {children}
              </thead>
            ),
            row: ({ children, ...props }: ComponentProps<'tr'>) => (
              <tr {...props} className={`${props.className || ''}`}>
                {children}
              </tr>
            ),
            cell: ({ children, ...props }: ComponentProps<'th'>) => (
              <th
                {...props}
                style={{ background: 'transparent' }}
                className={`border-b border-[#FFFFFF1F] p-4 text-left text-sm font-normal first:!pl-0 last:pl-8 ${props.className || ''}`}
              >
                {children}
              </th>
            )
          },
          body: {
            row: ({ children, ...props }: ComponentProps<'tr'>) => (
              <tr
                {...props}
                className={`border-b border-[#FFFFFF1F] last:border-b-0 ${props.className || ''}`}
                style={{ background: 'transparent' }}
              >
                {children}
              </tr>
            ),
            cell: ({ children, ...props }: ComponentProps<'td'>) => (
              <td
                {...props}
                className={`p-4 text-sm text-white first:!pl-0 last:pl-8 ${props.className || ''}`}
                style={{ background: 'transparent' }}
              >
                {children}
              </td>
            )
          }
        }}
      />
    </div>
  )
}

export default function CurrentStakingTab({
  refreshTrigger = 0,
  onGoToHistory
}: {
  refreshTrigger?: number
  onGoToHistory?: () => void
}) {
  const walletAddress = useCurrentWalletAddress()
  const [page, setPage] = useState(1)
  const pageSize = 6

  // 1. Get total count
  const {
    data: count,
    loading: loadingCount,
    refetch: refetchCount
  } = useContractRead<bigint>({
    contract: StakingContract,
    functionName: 'getTotalPositionsCount',
    args: [walletAddress],
    enabled: !!walletAddress
  })

  // 2. Get positions
  const offset = BigInt((page - 1) * pageSize)
  const limit = BigInt(pageSize)

  const {
    data: positions,
    loading: loadingPositions,
    refetch: refetchPositions
  } = useContractRead<PositionEntry[]>({
    contract: StakingContract,
    functionName: 'getUserPositions',
    args: [walletAddress, offset, limit],
    enabled: !!walletAddress && !!count && count > 0n
  })

  // 3. Get total staked amount (removed unused logic)

  // 4. Check Withdrawable
  const {
    data: withdrawableData,
    loading: loadingWithdrawable,
    refetch: refetchWithdrawable
  } = useContractRead<[bigint, readonly `0x${string}`[]]>({
    contract: StakingContract,
    functionName: 'getWithdrawableAmount',
    args: [walletAddress],
    enabled: !!walletAddress
  })

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetchCount()
      refetchPositions()
      refetchWithdrawable()
    }
  }, [refreshTrigger, refetchCount, refetchPositions, refetchWithdrawable])

  const [totalClaimableAmount, claimablePositionIds] = withdrawableData || [0n, []]

  const { writeContract, isLoading: isClaiming } = useContractWrite()
  const { writeContract: writeUnstake, isLoading: isUnstaking } = useContractWrite()
  const [unstakingId, setUnstakingId] = useState<string | null>(null)
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false)
  const [claimSuccessOpen, setClaimSuccessOpen] = useState(false)
  const [claimedAmount, setClaimedAmount] = useState('0')
  const [selectedUnstakeItem, setSelectedUnstakeItem] = useState<CurrentStakingItem | null>(null)

  const handleClaimAll = async () => {
    if (!claimablePositionIds || claimablePositionIds.length === 0) return

    const currentAmount = formatEther(totalClaimableAmount)

    try {
      await writeContract({
        contract: StakingContract,
        functionName: 'withdraw',
        args: [claimablePositionIds]
      })
      const data = await userApi.recordStakeClaimTransaction({ uids: claimablePositionIds as string[] })
      if (data?.status !== 1) throw new Error('Claim failed')
      // message.success('Claimed successfully')
      setClaimedAmount(currentAmount)
      setClaimSuccessOpen(true)

      refetchCount()
      refetchPositions()
      refetchWithdrawable()
    } catch (e) {
      message.error('Claim failed')
      console.error(e)
    }
  }

  const handleUnstakeClick = (item: CurrentStakingItem) => {
    setSelectedUnstakeItem(item)
    setUnstakeModalOpen(true)
  }

  const handleConfirmUnstake = async () => {
    if (!selectedUnstakeItem) return
    const positionId = selectedUnstakeItem.key
    setUnstakingId(positionId)
    try {
      const res = await writeUnstake({
        contract: StakingContract,
        functionName: 'unstake',
        args: [[positionId]]
      })
      console.log('writeUnstake', res)

      if (!res?.hash) throw new Error('Transaction failed')
      const data = await userApi.recordUnstakeTransaction({ uid: positionId, tx_hash: res.hash })
      if (data?.status !== 1) throw new Error('Unstake record failed')
      console.log('recordUnstakeTransaction', data)
      message.success('Unstake successfully')
      setUnstakeModalOpen(false)
    } catch (e) {
      message.error('Unstake failed')
      console.error(e)
    } finally {
      refetchCount()
      refetchPositions()
      refetchWithdrawable()
      setUnstakingId(null)
    }
  }

  const loading = loadingCount || loadingPositions || loadingWithdrawable

  const data: CurrentStakingItem[] = useMemo(() => {
    if (!positions) return []

    console.log('Positions', positions)

    return positions.map((pos) => ({
      key: pos.positionId,
      amount: `${formatNumber(Number(formatEther(pos.amount)))} ${STAKE_ASSET_TYPE}`,
      stakedAt: dayjs(Number(pos.startTime) * 1000).format('YYYY-MM-DD HH:mm'),
      unlockTime: pos.unlockTime > 0n ? dayjs(Number(pos.unlockTime) * 1000).format('YYYY-MM-DD HH:mm') : '-',
      status: pos.unlockTime > 0n ? 'Unstaking' : 'Staked',
      active: pos.unlockTime > 0n ? false : true,
      tx: pos.positionId,
      rawAmount: pos.amount
    }))
  }, [positions])

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
        <span className="text-sm text-[#8D8D93]" title={tx}>
          {tx.slice(0, 6)}...{tx.slice(-4)}
        </span>
      )
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active: boolean, record: CurrentStakingItem) => {
        const isLoading = isUnstaking && unstakingId === record.key
        return active ? (
          <Button
            type="text"
            className="h-[38px] w-[88px] rounded-full text-[#875DFF]"
            onClick={() => handleUnstakeClick(record)}
            loading={isLoading}
            disabled={isUnstaking && !isLoading}
          >
            Unstake
          </Button>
        ) : (
          <div className="flex items-center justify-center text-[#BBBBBE]">-</div>
        )
      }
    }
  ]

  return (
    <Spin spinning={loading}>
      <div
        className={cn(
          'mb-3 flex items-center justify-between rounded-xl bg-[#875DFF]/10 px-6 py-5 text-base',
          (!totalClaimableAmount || totalClaimableAmount === 0n) && 'hidden'
        )}
      >
        <div>
          <span className="text-white">{claimablePositionIds?.length || 0} active positions</span>
          <span className="mx-2 text-[#BBBBBE]">·</span>
          total <span className="text-[#875DFF]">{formatNumber(Number(formatEther(totalClaimableAmount)))}</span>{' '}
          {STAKE_ASSET_TYPE}
        </div>
        <Button
          loading={isClaiming}
          disabled={!totalClaimableAmount || totalClaimableAmount === 0n}
          onClick={handleClaimAll}
          className="h-[32px] rounded-full border border-[#875DFF] bg-transparent text-sm text-[#875DFF] hover:!border-white hover:!text-white disabled:border-[#FFFFFF1F] disabled:text-[#BBBBBE]"
        >
          Claim All
        </Button>
      </div>

      {/* Table */}
      <StakingTable<CurrentStakingItem>
        columns={columns}
        dataSource={data}
        total={Number(count || 0)}
        current={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
      />

      {unstakeModalOpen && selectedUnstakeItem && (
        <StakingActionModal
          open={unstakeModalOpen}
          onClose={() => setUnstakeModalOpen(false)}
          type="unstake"
          amount={formatEther(selectedUnstakeItem.rawAmount)}
          symbol={STAKE_ASSET_TYPE}
          onConfirm={handleConfirmUnstake}
          isLoading={isUnstaking}
        />
      )}

      {claimSuccessOpen && (
        <StakingActionModal
          open={claimSuccessOpen}
          onClose={() => setClaimSuccessOpen(false)}
          type="claim_success"
          amount={claimedAmount}
          symbol={STAKE_ASSET_TYPE}
          onViewHistory={() => {
            setClaimSuccessOpen(false)
            onGoToHistory?.()
          }}
        />
      )}
    </Spin>
  )
}
