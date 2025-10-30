import { useCallback, useEffect, useState } from 'react'

import { Button, message, Modal } from 'antd'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { base, mainnet, bsc, arbitrum, optimism, polygon, sepolia } from 'viem/chains'
import { getAddress } from 'viem'

import { shortenAddress } from '@/utils/wallet-address'

// import ConnectedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import contract from '@/contracts/did-base-registrar.abi'

function ChooseEvmWalletView({ onNext }: { onNext: (address: `0x${string}`) => void }) {
  const [network, setNetwork] = useState('Unknown Network')
  const [address, setAddress] = useState('')
  const [showWallet, setShowWallet] = useState(false)
  const [isTargetNetwork, setIsTargetNetwork] = useState(false)

  const { lastUsedWallet } = useCodattaConnectContext()

  const getWalletInfo = useCallback(async (): Promise<boolean> => {
    if (!lastUsedWallet || !lastUsedWallet.address || !lastUsedWallet.connected) {
      setShowWallet(true)
      return false
    }

    try {
      const address = getAddress(lastUsedWallet.address!)
      setAddress(address)

      const chainId = await lastUsedWallet.getChain()
      if (!chainId) throw new Error('Chain not found')

      const supportedChains = [mainnet, base, bsc, arbitrum, optimism, polygon, sepolia, contract.chain]
      const currentChain = supportedChains.find((chain) => chain.id === chainId)

      if (currentChain) {
        setNetwork(currentChain.name)
        const isTargetNetwork = currentChain.id === contract.chain.id
        setIsTargetNetwork(isTargetNetwork)
        return isTargetNetwork
      } else {
        setNetwork('Unknown Network')
        setIsTargetNetwork(false)
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }, [lastUsedWallet])

  const onSwitchToTargetNetwork = async () => {
    if (!lastUsedWallet) return

    try {
      const isSuccess = await lastUsedWallet?.switchChain(contract.chain)
      const isTargetNetwork = isSuccess && (await getWalletInfo())

      console.log('isTargetNetwork', isTargetNetwork)
      if (isTargetNetwork) {
        await message.success('Switched to ' + contract.chain.name).then(() => {
          onNext(address as `0x${string}`)
        })
      } else {
        await message.error('Failed to switch to ' + contract.chain.name)
      }
    } catch (error) {
      console.error(error)
      await message.error('Failed to switch to ' + contract.chain.name)
    }
  }

  const handleOnEvmWalletConnect = async (connectInfo: EmvWalletConnectInfo) => {
    setShowWallet(false)
    getWalletInfo()
    console.log('handleOnEvmWalletConnect', connectInfo)
  }

  useEffect(() => {
    getWalletInfo()
  }, [getWalletInfo])

  function View1() {
    return (
      <>
        <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
          <div className="flex items-center justify-between border-b border-b-[#FFFFFF1F] pb-3">
            <span className="text-lg font-bold">Address: {shortenAddress(address, 8)}</span>
            <span className="text-base text-[#FFA800]">Network: {network}</span>
          </div>
          {!isTargetNetwork ? (
            <p className="mt-6 text-base">
              DlD can be created on <span className="font-bold">{contract.chain.name}</span> only, Your{' '}
              <span className="font-bold">wallet extension</span> will prompt for confirmation.
            </p>
          ) : (
            <>
              <p className="mt-6 text-base font-bold">Connected to {contract.chain.name}. Ready to create DlD</p>
              <p className="mt-2 text-base text-[#8D8D93]">Address: {shortenAddress(address, 8)}</p>
            </>
          )}
        </div>

        <div className="my-12 flex items-center justify-center gap-4">
          <Button
            className="block h-[40px] w-[240px] rounded-full bg-white text-sm font-medium text-black"
            type="default"
            onClick={() => setShowWallet(true)}
          >
            Back
          </Button>
          {isTargetNetwork ? (
            <Button
              type="primary"
              className="block h-[40px] w-[240px] rounded-full font-medium"
              onClick={() => onNext(address as `0x${string}`)}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              className="block h-[40px] w-[240px] rounded-full font-medium"
              onClick={onSwitchToTargetNetwork}
            >
              Switch to {contract.chain.name}
            </Button>
          )}
        </div>
      </>
    )
  }

  // function View2() {
  //   return (
  //     <>
  //       <div className="mt-6 rounded-2xl border border-[#FFFFFF1F] px-6 py-4 text-center">
  //         <ConnectedIcon className="mx-auto block size-[60px]" />
  //         <p className="mt-6 text-xl font-bold">Connected to {contract.chain.name}. Ready to create DlD</p>
  //         <p className="mt-2 text-base text-[#8D8D93]">Address: {shortenAddress(address, 8)}</p>
  //       </div>
  //       <div className="my-12 flex items-center justify-center gap-4">
  //         <Button
  //           className="h-[40px] w-[240px] rounded-full bg-white text-sm font-medium text-black"
  //           type="default"
  //           onClick={() => setShowWallet(true)}
  //         >
  //           Back
  //         </Button>
  //         <Button
  //           type="primary"
  //           className="block h-[40px] w-[240px] rounded-full"
  //           onClick={() => onNext(address as `0x${string}`)}
  //         >
  //           Continue
  //         </Button>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <div className="mx-auto my-12 w-[612px] text-base">
      <h4 className="text-xl font-bold">Choose your EVM wallet</h4>
      {/* {!isTargetNetwork ? <View1 /> : <View2 />} */}
      <View1 />
      <Modal
        open={showWallet}
        onCancel={() => setShowWallet(false)}
        width={468}
        footer={null}
        styles={{ content: { padding: 0 } }}
        destroyOnHidden
        maskClosable={false}
      >
        <CodattaConnect
          config={{ showTonConnect: false, showFeaturedWallets: true }}
          onEvmWalletConnect={handleOnEvmWalletConnect}
        ></CodattaConnect>
      </Modal>
    </div>
  )
}

export default ChooseEvmWalletView
