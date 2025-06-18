import { WalletItem } from 'codatta-connect'
import { ArrowLeft, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { shortenAddress } from '@/utils/wallet-address'
import { Button } from 'antd'

export default function WalletConfirmView(props: {
  walletItem: WalletItem
  onBack: () => void
  onContinue: () => void
  onSwitchWallet: () => void
}) {
  const { walletItem, onContinue, onSwitchWallet } = props
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    walletItem.client?.getAddresses().then((addresses: string[]) => {
      const address = addresses[0]
      setAddress(address)
    })
  }, [walletItem])

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <div className="flex w-full items-center gap-2">
        <ArrowLeft onClick={props.onBack} size={20} className="cursor-pointer"></ArrowLeft>
        <span className="font-bold">Check in</span>
      </div>
      <div>
        <div className="mb-6 flex flex-col items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
          {walletItem.config?.image ? (
            <img className="size-16 rounded-lg" src={walletItem.config.image} alt="" />
          ) : (
            <Wallet></Wallet>
          )}
          {/* <div className='flex flex-col items-start'> */}
          <p className="text-base">{shortenAddress(address || '')}</p>
          <div className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-xs">
            <div className="size-1 rounded-full bg-[#00FF00]"></div>Connected
          </div>
          {/* </div> */}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button size="large" shape="round" onClick={onSwitchWallet}>
            Switch wallet
          </Button>
          <Button type="primary" shape="round" size="large" className="w-[160px]" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
