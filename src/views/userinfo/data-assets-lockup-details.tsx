import { Button, Pagination, Spin, message } from 'antd'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { createPublicClient, http, formatEther, Address } from 'viem'
import { useCodattaConnectContext } from 'codatta-connect'
import { cn } from '@udecode/cn'
import dayjs from 'dayjs'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

import LockRewardContract from '@/contracts/lock-claim-reward.abi'
import { TOKEN_CONTRACT_ADDRESS } from '@/components/settings/config'

// Define the LockupEntry type based on the ABI
interface LockupEntry {
  uid: `0x${string}`
  token: Address
  amount: bigint
  releaseTime: bigint
}

// Grouped entry for display
interface GroupedLockup {
  releaseTime: number
  status: 'Locked' | 'To Claim'
  items: LockupEntry[]
}

export default function LockupDetails() {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [loading, setLoading] = useState(false)
  const [lockups, setLockups] = useState<GroupedLockup[]>([])
  const [tokensToClaim, setTokensToClaim] = useState<{ name: string; amount: number }[]>([
    { name: 'USDT', amount: 0 },
    { name: 'XNY', amount: 0 }
  ])

  const canClaim = useMemo(() => tokensToClaim.some((token) => token.amount > 0), [tokensToClaim])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20

  const handleClaim = () => {
    // TODO: Implement claim logic
    message.info('Claim feature coming soon')
  }

  const rpcClient = useMemo(() => {
    return createPublicClient({
      chain: LockRewardContract.chain,
      transport: http(LockRewardContract.chain.rpcUrls.default.http[0])
    })
  }, [])

  const tokenMap = useMemo(() => {
    return Object.entries(TOKEN_CONTRACT_ADDRESS).reduce(
      (acc, [key, val]) => {
        acc[val.toLowerCase()] = key === 'XnYCoin' ? 'XNY' : key
        return acc
      },
      {} as Record<string, string>
    )
  }, [])

  const fetchClaimableAmounts = useCallback(async () => {
    if (!lastUsedWallet?.address) return

    try {
      const userAddress = lastUsedWallet.address as Address

      const [tokens, amounts] = (await rpcClient.readContract({
        address: LockRewardContract.address as Address,
        abi: LockRewardContract.abi,
        functionName: 'getClaimableAmounts',
        args: [userAddress]
      })) as [Address[], bigint[]]

      console.log('tokens:', tokens)
      console.log('amounts:', amounts)
      if (!tokens || !amounts || tokens.length === 0) {
        setTokensToClaim([
          { name: 'USDT', amount: 0 },
          { name: 'XNY', amount: 0 }
        ])
        return
      }

      const totals: Record<string, number> = {}

      tokens.forEach((token, index) => {
        const symbol = tokenMap[token.toLowerCase()] || 'Unknown'
        const rawAmount = amounts[index] ?? 0n
        if (rawAmount === 0n) return

        const formatted = Number(formatEther(rawAmount))
        if (!Number.isFinite(formatted)) return

        totals[symbol] = (totals[symbol] || 0) + formatted
      })

      const usdt = totals['USDT'] ?? 0
      const xny = totals['XNY'] ?? 0

      setTokensToClaim([
        { name: 'USDT', amount: usdt },
        { name: 'XNY', amount: xny }
      ])
    } catch (error) {
      console.error('Failed to fetch claimable amounts:', error)
      // Keep existing state to avoid interrupting the page
    }
  }, [lastUsedWallet, rpcClient, tokenMap])

  const fetchLockups = useCallback(async () => {
    if (!lastUsedWallet?.address) return

    setLoading(true)
    try {
      const userAddress = lastUsedWallet.address as Address

      // Fetch total count
      const count = await rpcClient.readContract({
        address: LockRewardContract.address as Address,
        abi: LockRewardContract.abi,
        functionName: 'getLockupsCount',
        args: [userAddress]
      })
      setTotal(Number(count))

      if (Number(count) > 0) {
        // Fetch items
        const offset = BigInt((page - 1) * pageSize)
        const limit = BigInt(pageSize)

        const data = (await rpcClient.readContract({
          address: LockRewardContract.address as Address,
          abi: LockRewardContract.abi,
          functionName: 'getUserLockups',
          args: [userAddress, offset, limit]
        })) as LockupEntry[]

        // Process and group data
        const now = Date.now() / 1000
        const groups: Record<string, LockupEntry[]> = {}

        data.forEach((item) => {
          const timeKey = item.releaseTime.toString()
          if (!groups[timeKey]) {
            groups[timeKey] = []
          }
          groups[timeKey].push(item)
        })

        const groupedList: GroupedLockup[] = []
        let currentGroup: GroupedLockup | null = null

        data.forEach((item) => {
          const itemTime = Number(item.releaseTime)
          if (currentGroup && currentGroup.releaseTime === itemTime) {
            currentGroup.items.push(item)
          } else {
            if (currentGroup) {
              groupedList.push(currentGroup)
            }
            const isLocked = itemTime > now
            currentGroup = {
              releaseTime: itemTime,
              status: isLocked ? 'Locked' : 'To Claim',
              items: [item]
            }
          }
        })
        if (currentGroup) {
          groupedList.push(currentGroup)
        }

        setLockups(groupedList)
      } else {
        setLockups([])
      }
    } catch (err) {
      console.error('Failed to fetch lockups:', err)
      message.error('Failed to fetch lockup details')
    } finally {
      setLoading(false)
    }
  }, [lastUsedWallet, page, rpcClient])

  useEffect(() => {
    fetchLockups()
  }, [fetchLockups])

  useEffect(() => {
    fetchClaimableAmounts()
  }, [fetchClaimableAmounts])

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h3 className="mb-2 text-[32px] font-bold leading-[48px]">Lock-up details</h3>
          <p className="text-sm text-[#BBBBBE]">
            Lock-up positions for the connected wallet. Data is read directly from the lock-up contract.
          </p>
        </div>
        <div className={cn('flex items-center rounded-2xl bg-[#875DFF] p-3', canClaim ? 'flex' : '')}>
          {tokensToClaim.map((token, index) => (
            <div key={index} className="mr-3 flex items-center">
              {token.name === 'USDT' ? <USDTIcon className="size-6" /> : <XnyIcon className="size-6" />}
              <span className="ml-2">{token.amount.toLocaleString()}</span>
            </div>
          ))}
          <Button
            type="primary"
            className="ml-3 h-[34px] rounded-full border-none bg-gradient-to-b from-[#FFEA98] to-[#FCC800] px-3 text-sm font-semibold leading-[34px] text-[#1C1C26] hover:!bg-gradient-to-b"
            onClick={handleClaim}
          >
            Claim All
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="w-full rounded-2xl bg-[#252532] p-6 text-sm text-white">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-[#FFFFFF1F] pb-4 pr-[80px]">
            <div>Lock Time</div>
            <div className="text-center">Statu</div>
            <div className="text-right">Reward</div>
          </div>

          {/* List */}
          {lockups.length > 0 ? (
            <div className="flex flex-col">
              {lockups.map((group, idx) => (
                <div key={idx} className="grid grid-cols-3 items-center border-b border-[#FFFFFF1F] py-6 text-sm">
                  {/* Lock Time */}
                  <div>{dayjs(group.releaseTime * 1000).format('YYYY-MM-DD HH:mm')}</div>

                  {/* Status */}
                  <div className="flex items-center justify-center">
                    <div
                      className={cn(
                        'flex h-[26px] w-[82px] items-center justify-center rounded-full border border-[#FFFFFF1F]',
                        {
                          'text-[#5DDD22]': group.status === 'To Claim',
                          'text-[#BBBBBE]': group.status !== 'To Claim'
                        }
                      )}
                    >
                      {group.status}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex flex-col items-end gap-1 pr-[80px]">
                    {group.items.map((item, i) => {
                      const symbol = tokenMap[item.token.toLowerCase()] || 'Unknown'
                      const amount = formatEther(item.amount) // Assuming 18 decimals
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span>{symbol}</span>
                          <span className="font-semibold text-[#875DFF]">
                            +
                            {Number(amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center text-[#BBBBBE]">No lockup records found.</div>
          )}
        </div>

        {total > 0 && (
          <Pagination
            className="mt-8"
            align="center"
            hideOnSinglePage
            current={page}
            pageSize={pageSize}
            onChange={(p) => setPage(p)}
            total={total}
            showSizeChanger={false}
          />
        )}
      </Spin>
    </div>
  )
}
