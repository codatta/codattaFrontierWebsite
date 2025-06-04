import { WalletItem } from 'codatta-connect'
import { Abi, Chain } from 'viem'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Loader2, Wallet } from 'lucide-react'

export default function ContractCallView(props: {
  title: string
  walletItem: WalletItem
  contract: { abi: Abi; address: string; chain: Chain }
  onCallContract: () => Promise<void>
  onBack: () => void
  onSuccess: () => void
}) {
  const [error, setError] = useState<string>()
  const { walletItem, onBack, onSuccess, contract, onCallContract, title } = props
  const [guideType, setGuideType] = useState<'switch-network' | 'get-ready' | 'waiting'>('switch-network')

  const handleCheckIn = useCallback(
    async (walletItem: WalletItem) => {
      try {
        setGuideType('switch-network')
        const walletChainId = await walletItem.client?.getChainId()
        console.debug('chain check:', walletChainId, contract.chain.id)
        if (walletChainId !== contract.chain.id) {
          try {
            await walletItem.client?.addChain({ chain: contract.chain })
          } catch (err) {
            console.log(err)
          }
          await walletItem.client?.switchChain(contract.chain)
        }

        setGuideType('get-ready')
        await onCallContract()
        onSuccess?.()
      } catch (err) {
        setError(err.details || err.message)
      }
    },
    [onCallContract, onSuccess, contract.chain]
  )

  function handleRetry() {
    setError('')
    handleCheckIn(walletItem)
  }

  useEffect(() => {
    handleCheckIn(walletItem)
  }, [walletItem, handleCheckIn])

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex w-full items-center gap-2">
        <ArrowLeft onClick={onBack} size={20} className="cursor-pointer"></ArrowLeft>
        <span className="font-bold">{title}</span>
      </div>
      {walletItem.config?.image ? (
        <img className="size-16 rounded-lg" src={walletItem.config.image} alt="" />
      ) : (
        <Wallet size={64}></Wallet>
      )}

      {error && (
        <div className="flex flex-col items-center">
          <p className="mb-2 text-center text-[red]">{error}</p>
          <button className="rounded-full bg-gray-100 px-6 py-1" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}
      {!error && (
        <>
          {guideType === 'switch-network' && (
            <span className="text-center">Allow a network switching in your wallet</span>
          )}
          {guideType === 'get-ready' && (
            <span className="text-center">Allow a contract interaction in your wallet</span>
          )}
          {guideType === 'waiting' && (
            <span className="text-center">
              <Loader2 className="animate-spin"></Loader2>
            </span>
          )}
        </>
      )}
    </div>
  )
}
