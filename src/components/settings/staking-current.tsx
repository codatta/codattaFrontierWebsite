import { Button, TableProps, Spin, Pagination } from 'antd'
import { useState, useMemo } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'
import { formatEther } from 'viem'
import dayjs from 'dayjs'

import StakingTable from './staking-table'
import StakingContract, { STAKE_ASSET_TYPE } from '@/contracts/staking.abi'
import { formatNumber } from '@/utils/str'
import { useContractRead } from '@/hooks/use-contract-read'

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

export default function CurrentStakingTab() {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [page, setPage] = useState(1)
  const pageSize = 10

  // 1. Get total count
  const { data: count, loading: loadingCount } = useContractRead<bigint>({
    contract: StakingContract,
    functionName: 'getUserActivePositionsCount',
    args: [lastUsedWallet?.address],
    enabled: !!lastUsedWallet?.address
  })

  // 2. Get positions
  const offset = BigInt((page - 1) * pageSize)
  const limit = BigInt(pageSize)

  const { data: positions, loading: loadingPositions } = useContractRead<PositionEntry[]>({
    contract: StakingContract,
    functionName: 'getUserActivePositions',
    args: [lastUsedWallet?.address, offset, limit],
    enabled: !!lastUsedWallet?.address && !!count && count > 0n
  })

  // 3. Get total staked amount
  const { data: totalStakedAmount, loading: loadingTotal } = useContractRead<bigint>({
    contract: StakingContract,
    functionName: 'userTotalStaked',
    args: [lastUsedWallet?.address],
    enabled: !!lastUsedWallet?.address
  })

  const loading = loadingCount || loadingPositions || loadingTotal

  const data: CurrentStakingItem[] = useMemo(() => {
    if (!positions) return []
    return positions.map((pos) => ({
      key: pos.positionId,
      amount: `${formatNumber(Number(formatEther(pos.amount)))} ${STAKE_ASSET_TYPE}`,
      stakedAt: dayjs(Number(pos.startTime) * 1000).format('YYYY-MM-DD HH:mm'),
      unlockTime: pos.unlockTime > 0n ? dayjs(Number(pos.unlockTime) * 1000).format('YYYY-MM-DD HH:mm') : '-',
      status: 'Staked',
      tx: pos.positionId,
      active: true,
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
    <Spin spinning={loading}>
      <div className="mb-3 flex items-center justify-between rounded-xl bg-[#875DFF]/10 px-6 py-5 text-base">
        <div>
          <span className="text-white">{Number(count || 0)} active positions</span>
          <span className="mx-2 text-[#BBBBBE]">·</span>
          total <span className="text-[#875DFF]">
            {formatNumber(Number(formatEther(totalStakedAmount || 0n)))}
          </span>{' '}
          {STAKE_ASSET_TYPE}
        </div>
        <Button className="h-[32px] rounded-full border border-[#875DFF] bg-transparent text-sm text-[#875DFF] hover:!border-white hover:!text-white">
          Claim All
        </Button>
      </div>

      {/* Table */}
      <StakingTable<CurrentStakingItem> columns={columns} dataSource={data} />

      {Number(count || 0) > pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={Number(count || 0)}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
            align="center"
          />
        </div>
      )}
    </Spin>
  )
}
