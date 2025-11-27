import { useCallback, useState } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'
import { Abi, Chain, createPublicClient, Hash, http, TransactionReceipt } from 'viem'

export interface ContractCallConfig {
  contract: {
    abi: Abi
    address: string
    chain: Chain
  }
  functionName: string
  args: unknown[]
  value?: bigint
}

export type WriteStep = 'idle' | 'switching' | 'simulating' | 'writing' | 'confirming' | 'success'

const STEP_TIPS: Record<WriteStep, string> = {
  idle: '',
  switching: 'Switching network...',
  simulating: 'Create transaction...',
  writing: 'Please check and approve the transaction in your wallet.',
  confirming: 'Waiting for transaction to be confirmed...',
  success: 'Transaction successful'
}

export function useContractWrite(options?: { onStepChange?: (step: WriteStep) => void }) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [step, setStep] = useState<WriteStep>('idle')
  const [error, setError] = useState<Error | null>(null)

  // Helper to get RPC client
  const getRpcClient = useCallback((chain: Chain) => {
    const rpcUrl = chain.rpcUrls.default.http[0]
    return createPublicClient({
      chain,
      transport: http(rpcUrl)
    })
  }, [])

  const updateStep = useCallback(
    (newStep: WriteStep) => {
      setStep(newStep)
      options?.onStepChange?.(newStep)
    },
    [options]
  )

  const writeContract = useCallback(
    async (config: ContractCallConfig): Promise<{ hash: Hash; receipt: TransactionReceipt }> => {
      setError(null)

      try {
        const { contract, functionName, args, value } = config
        const walletAddress = lastUsedWallet?.address

        if (!walletAddress || !lastUsedWallet?.client) throw new Error('Wallet not connected')

        const rpcClient = getRpcClient(contract.chain)

        // Switch Chain if needed
        const currentChainId = await lastUsedWallet.getChain()
        if (currentChainId !== contract.chain.id) {
          updateStep('switching')
          await lastUsedWallet.switchChain(contract.chain)
        }

        // Simulate
        updateStep('simulating')
        const { request } = await rpcClient.simulateContract({
          account: walletAddress as `0x${string}`,
          address: contract.address as `0x${string}`,
          abi: contract.abi,
          functionName,
          args,
          value,
          chain: contract.chain
        })

        // Write
        updateStep('writing')
        const hash = await lastUsedWallet.client.writeContract(request)

        // Wait for Receipt
        updateStep('confirming')
        const receipt = await rpcClient.waitForTransactionReceipt({ hash })

        if (receipt.status !== 'success') {
          throw new Error('Transaction reverted on chain')
        }

        updateStep('success')
        return { hash, receipt }
      } catch (err: unknown) {
        const errorObj = err as Error
        setError(errorObj)
        throw errorObj
      }
    },
    [lastUsedWallet, getRpcClient, updateStep]
  )

  const reset = useCallback(() => {
    setStep('idle')
    setError(null)
  }, [])

  return {
    writeContract,
    reset,
    step,
    tip: STEP_TIPS[step],
    isLoading: step !== 'idle' && step !== 'success',
    error
  }
}
