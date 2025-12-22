import { useCallback, useEffect, useState, useMemo } from 'react'
import { Abi, Chain, createPublicClient, http } from 'viem'

export interface UseContractReadConfig {
  contract: {
    address: string
    abi: Abi
    chain: Chain
  }
  functionName: string
  args?: unknown[]
  enabled?: boolean
}

export function useContractRead<T = unknown>({
  contract,
  functionName,
  args = [],
  enabled = true
}: UseContractReadConfig) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Create a stable key for args to prevent infinite loops with inline arrays
  const argsKey = useMemo(() => {
    return JSON.stringify(args, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
  }, [args])

  const fetchData = useCallback(async () => {
    console.log('fetchData', functionName, enabled, contract.address, contract.chain, args)
    if (!enabled) {
      // console.debug(`[useContractRead] Skipped ${functionName}: disabled`)
      return
    }
    if (!contract.address || !contract.chain) {
      console.warn(`[useContractRead] Skipped ${functionName}: missing address or chain`, contract)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const client = createPublicClient({
        chain: contract.chain,
        transport: http(contract.chain.rpcUrls.default.http[0])
      })

      const result = await client.readContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName,
        args
      })

      setData(result as T)
    } catch (err) {
      console.error(`Failed to read contract ${functionName}:`, err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.address, contract.chain, contract.abi, functionName, enabled, argsKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}
