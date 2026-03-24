import { useCallback, useEffect, useState } from 'react'
import { calculateGasFeeFromApi, getChainKeyByChainId } from '@/utils/gas-calculator'

interface UseGasFeeOptions {
  gasLimit: number
  chainId?: number
  enabled?: boolean
  tokenAddress: string // ERC20 token address for fee calculation
}

interface UseGasFeeResult {
  gasFee: string | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook to calculate and manage gas fee estimation in specific ERC20 token
 *
 * @param options - Configuration options
 * @returns Gas fee state and controls
 */
export function useGasFee({ gasLimit, chainId, enabled = true, tokenAddress }: UseGasFeeOptions): UseGasFeeResult {
  const [gasFee, setGasFee] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchGasFee = useCallback(async () => {
    if (!enabled || !chainId || !tokenAddress) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const chainKey = getChainKeyByChainId(chainId)
      const fee = await calculateGasFeeFromApi(gasLimit, chainKey, tokenAddress)
      setGasFee(fee.toFixed(4))
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error('Failed to fetch gas fee:', error)
    } finally {
      setIsLoading(false)
    }
  }, [enabled, chainId, gasLimit, tokenAddress])

  useEffect(() => {
    fetchGasFee()
  }, [fetchGasFee])

  return {
    gasFee,
    isLoading,
    error,
    refetch: fetchGasFee
  }
}
