import { useState, useEffect, useCallback } from 'react'
import { Abi, Chain, encodeFunctionData, formatEther, PublicClient, createPublicClient, http } from 'viem'

/**
 * Calculate gas estimation with proper fee data handling
 * Supports both EIP-1559 and legacy transactions
 */
export async function calculateGasEstimation({
  rpcClient,
  account,
  to,
  data,
  value
}: {
  rpcClient: PublicClient
  account: `0x${string}`
  to: `0x${string}`
  data: `0x${string}`
  value?: bigint
}): Promise<{ gasLimit: bigint; totalCost: bigint; totalCostFormatted: string }> {
  // Estimate gas limit
  const estimatedGasLimit = await rpcClient.estimateGas({
    account,
    to,
    data,
    value
  })

  // Get fee data for EIP-1559 support detection
  let totalGasCost: bigint
  try {
    const feeData = await rpcClient.estimateFeesPerGas()

    // Calculate total gas cost based on EIP-1559 support
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      // EIP-1559 transaction (e.g., Base mainnet)
      totalGasCost = estimatedGasLimit * feeData.maxFeePerGas
      console.log('Using EIP-1559 pricing', { maxFeePerGas: feeData.maxFeePerGas })
    } else {
      const gasPrice = feeData.gasPrice || (await rpcClient.getGasPrice())
      // Legacy transaction (e.g., Kite testnet, BSC)
      totalGasCost = estimatedGasLimit * gasPrice
      console.log('Using legacy pricing', { gasPrice })
    }
  } catch (feeError) {
    console.warn('Failed to get fee data, using fallback', feeError)
    // Fallback: try to get gas price directly for networks like Kite
    const gasPrice = await rpcClient.getGasPrice()
    totalGasCost = estimatedGasLimit * gasPrice
    console.log('Using fallback gas price', { gasPrice })
  }

  const totalCostFormatted = formatEther(totalGasCost)

  return {
    gasLimit: estimatedGasLimit,
    totalCost: totalGasCost,
    totalCostFormatted
  }
}

// Helper to get RPC client
const getRpcClient = (chain: Chain) => {
  const rpcUrl = chain.rpcUrls.default.http[0]
  return createPublicClient({
    chain,
    transport: http(rpcUrl)
  })
}

export function useGasEstimation({
  address,
  rpcClient: providedRpcClient,
  contract,
  functionName,
  contractArgs
}: {
  address: `0x${string}`
  rpcClient?: PublicClient
  contract: { abi: Abi; chain: Chain; address: string }
  functionName: string
  contractArgs: (string | bigint | number)[] | (string | bigint | number)[][]
}) {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<string>('0')
  const [estimateGas, setEstimateGas] = useState<string>('0')
  const [gasLimit, setGasLimit] = useState<string>('0')
  const [gasWarning, setGasWarning] = useState('')
  const [gasChecked, setGasChecked] = useState(false)

  const checkGas = useCallback(async () => {
    const client = providedRpcClient || getRpcClient(contract.chain)

    const getBalance = async (address: `0x${string}`) => {
      if (!address) return
      const balance = await client.getBalance({
        address
      })
      const balanceStr = formatEther(balance)

      console.log('balance', balanceStr)
      setBalance(balanceStr)
      return balanceStr
    }

    const getEstimateGas = async (address: `0x${string}`) => {
      if (!address || contractArgs?.length === 0) return

      console.log('contractArgs for gas estimation:', contractArgs)

      try {
        const data = encodeFunctionData({
          abi: contract.abi,
          functionName,
          args: contractArgs
        }) as `0x${string}`

        const result = await calculateGasEstimation({
          rpcClient: client,
          account: address,
          to: contract.address as `0x${string}`,
          data
        })

        setGasLimit(result.gasLimit.toString())
        setEstimateGas(result.totalCostFormatted)

        console.log('Gas estimation complete:', {
          gasLimit: result.gasLimit.toString(),
          totalCost: result.totalCostFormatted,
          chain: contract.chain.name
        })

        return result.totalCostFormatted
      } catch (error) {
        console.error('Gas estimation failed:', error)
        setEstimateGas('0')
        setGasLimit('0')
        return '0'
      }
    }

    try {
      if (!address || !contractArgs.length) return

      setLoading(true)
      setGasWarning('')
      setGasChecked(false)
      const balance = await getBalance(address)
      const estimateGas = await getEstimateGas(address)

      console.log('balance', balance, 'estimateGas', estimateGas)

      if (balance && estimateGas) {
        if (Number(balance) < Number(estimateGas)) {
          setGasWarning('Balance insufficient to cover gas. Please top up and try again.')
        } else {
          setGasChecked(true)
        }
      }
    } catch (error) {
      console.error(error)
      setGasWarning('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [address, providedRpcClient, contract, functionName, contractArgs])

  useEffect(() => {
    checkGas()
  }, [checkGas])

  return {
    loading,
    balance,
    estimateGas,
    gasLimit,
    gasWarning,
    gasChecked,
    refetch: checkGas
  }
}
