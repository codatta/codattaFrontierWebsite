import { useCallback, useEffect, useState } from 'react'
import { Chain, createPublicClient, formatEther, http } from 'viem'

export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

interface UseTokenContractProps {
  tokenAddress?: string
  ownerAddress?: string
  spenderAddress?: string
  chain: Chain
  enabled?: boolean
}

export function useTokenContract({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  chain,
  enabled = true
}: UseTokenContractProps) {
  const [balance, setBalance] = useState<string>('0')
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [loading, setLoading] = useState(false)

  const fetchTokenInfo = useCallback(async () => {
    if (!enabled || !ownerAddress || !tokenAddress || /^0x0+$/.test(tokenAddress) || !spenderAddress) {
      setBalance('0')
      setAllowance(0n)
      return
    }

    setLoading(true)
    try {
      const publicClient = createPublicClient({
        chain,
        transport: http()
      })

      const [bal, allow] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [ownerAddress as `0x${string}`]
        }),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`]
        })
      ])

      setBalance(formatEther(bal))
      setAllowance(allow)
    } catch (error) {
      console.error('Failed to fetch token info:', error)
    } finally {
      setLoading(false)
    }
  }, [enabled, ownerAddress, tokenAddress, spenderAddress, chain])

  useEffect(() => {
    fetchTokenInfo()
  }, [fetchTokenInfo])

  return {
    balance,
    allowance,
    loading,
    refetch: fetchTokenInfo
  }
}
