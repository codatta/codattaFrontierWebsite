import { useState, useEffect, useCallback } from 'react'
import { Abi, Chain, encodeFunctionData, formatEther, PublicClient } from 'viem'

import contract from '@/contracts/did-base-registrar.abi'

export function useGasEstimation({
  address,
  rpcClient,
  contractArgs
}: {
  address: `0x${string}`
  rpcClient: PublicClient
  contractArgs: string[] | string[][]
}) {
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState<string>('0')
  const [estimateGas, setEstimateGas] = useState<string>('0')
  const [gasWarning, setGasWarning] = useState('')
  const [gasChecked, setGasChecked] = useState(false)

  const checkGas = useCallback(async () => {
    const getBalance = async (address: `0x${string}`) => {
      if (!address) return
      const balance = await rpcClient.getBalance({
        address
      })
      const balanceStr = formatEther(balance)

      console.log('balance', balanceStr)
      setBalance(balanceStr)
      return balanceStr
    }

    const getEstimateGas = async (contract: { abi: Abi; chain: Chain; address: string }, address: `0x${string}`) => {
      if (!address) return

      try {
        const estimateGas = await rpcClient.estimateGas({
          account: address,
          to: contract.address as `0x${string}`,
          data: encodeFunctionData({
            abi: contract.abi,
            functionName: 'registerWithAuthorization',
            args: contractArgs
          })
        })
        const estimateGasStr = formatEther(estimateGas)
        setEstimateGas(estimateGasStr)

        console.log('estimateGas', estimateGasStr, estimateGas)
        return estimateGasStr
      } catch (error) {
        console.error(error)
        setEstimateGas('0')
        return '0'
      }
    }

    try {
      if (!address || !rpcClient || !contractArgs.length) return

      setLoading(true)
      setGasWarning('')
      setGasChecked(false)
      const balance = await getBalance(address)
      const estimateGas = await getEstimateGas(contract, address)

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
  }, [address, rpcClient, contractArgs])

  useEffect(() => {
    checkGas()
  }, [checkGas])

  return {
    loading,
    balance,
    estimateGas,
    gasWarning,
    gasChecked,
    refetch: checkGas
  }
}
