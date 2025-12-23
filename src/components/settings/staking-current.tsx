import { Button, TableProps, Spin, message, Table } from 'antd'
import { useState, useMemo, ComponentProps, useEffect } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'
import { formatEther } from 'viem'
import dayjs from 'dayjs'

import StakingContract, { STAKE_ASSET_TYPE } from '@/contracts/staking.abi'
import { formatNumber } from '@/utils/str'
import { useContractRead } from '@/hooks/use-contract-read'
import { useContractWrite } from '@/hooks/use-contract-write'
import userApi from '@/apis/user.api'

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
    <div className="rounded-2xl p-6">
      <Table
        className="[&_.ant-table-placeholder]:border-b-0 [&_.ant-table-placeholder_.ant-empty-description]:text-[#BBBBBE] [&_.ant-table-placeholder_.ant-empty]:flex [&_.ant-table-placeholder_.ant-empty]:flex-col [&_.ant-table-placeholder_.ant-empty]:items-center [&_.ant-table-placeholder_.ant-table-cell]:!px-0 [&_.ant-table-placeholder_.ant-table-cell]:!text-center [&_.ant-table]:bg-transparent"
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
                className={`border-b border-[#FFFFFF1F] p-4 text-left text-sm font-normal first:!pl-0 last:pl-8 ${props.className || ''}`}
              >
                {children}
              </th>
            )
          },
          body: {
            row: ({ children, ...props }: ComponentProps<'tr'>) => (
              <tr {...props} className={`border-b border-[#FFFFFF1F] last:border-b-0 ${props.className || ''}`}>
                {children}
              </tr>
            ),
            cell: ({ children, ...props }: ComponentProps<'td'>) => (
              <td {...props} className={`p-4 text-sm text-white first:!pl-0 last:pl-8 ${props.className || ''}`}>
                {children}
              </td>
            )
          }
        }}
      />
    </div>
  )
}

export default function CurrentStakingTab({ refreshTrigger }: { refreshTrigger?: number }) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [page, setPage] = useState(1)
  const pageSize = 10

  // 1. Get total count
  const {
    data: count,
    loading: loadingCount,
    refetch: refetchCount
  } = useContractRead<bigint>({
    contract: StakingContract,
    functionName: 'getTotalPositionsCount',
    args: [lastUsedWallet?.address],
    enabled: !!lastUsedWallet?.address
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
    args: [lastUsedWallet?.address, offset, limit],
    enabled: !!lastUsedWallet?.address && !!count && count > 0n
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
    args: [lastUsedWallet?.address],
    enabled: !!lastUsedWallet?.address
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

  const handleClaimAll = async () => {
    if (!claimablePositionIds || claimablePositionIds.length === 0) return

    try {
      await writeContract({
        contract: StakingContract,
        functionName: 'withdraw',
        args: [claimablePositionIds]
      })
      message.success('Claimed successfully')
      refetchCount()
      refetchPositions()
      refetchWithdrawable()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUnstake = async (positionId: string) => {
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
            onClick={() => handleUnstake(record.key)}
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
      <div className="mb-3 flex items-center justify-between rounded-xl bg-[#875DFF]/10 px-6 py-5 text-base">
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
    </Spin>
  )
}
