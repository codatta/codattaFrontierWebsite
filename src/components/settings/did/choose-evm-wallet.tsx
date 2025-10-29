import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Modal } from 'antd'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { base, mainnet, bsc, arbitrum, optimism, polygon, sepolia } from 'viem/chains'
import { getAddress } from 'viem'

import { shortenAddress } from '@/utils/wallet-address'

import ConnectedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import contract from '@/contracts/did-base-registrar.abi'

function ChooseEvmWalletView({ onNext }: { onNext: (address: `0x${string}`) => void }) {
  const [network, setNetwork] = useState('Unknown Network')
  const [address, setAddress] = useState('0x')
  const [showWallet, setShowWallet] = useState(false)
  const isTargetNetwork = useMemo(
    () => network.toLocaleLowerCase() === contract.chain.name.toLocaleLowerCase(),
    [network]
  )

  const { lastUsedWallet } = useCodattaConnectContext()

  const getWalletInfo = useCallback(async () => {
    if (!lastUsedWallet || !lastUsedWallet.address) {
      return
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
      } else {
        setNetwork('Unknown Network')
      }
    } catch (error) {
      console.error(error)
    }
  }, [lastUsedWallet])

  const onSwitchToTargetNetwork = async () => {
    const res = await lastUsedWallet?.switchChain(contract.chain)
    await getWalletInfo()
    console.log('re', res)
  }

  const handleOnEvmWalletConnect = async (connectInfo: EmvWalletConnectInfo) => {
    setShowWallet(false)
    getWalletInfo()
    console.log(connectInfo)
  }

  useEffect(() => {
    if (!lastUsedWallet || !lastUsedWallet.connected) {
      setShowWallet(true)
    } else {
      getWalletInfo()
    }
  }, [getWalletInfo, lastUsedWallet])

  function View1() {
    return (
      <>
        <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
          <div className="flex items-center justify-between border-b border-b-[#FFFFFF1F] pb-3">
            <span className="text-lg font-bold">Address: {shortenAddress(address, 8)}</span>
            <span className="text-base text-[#FFA800]">Network: {network}</span>
          </div>
          <p className="mt-6 text-base">
            DlD can be created on <span className="font-bold">{contract.chain.name}</span> only, Your{' '}
            <span className="font-bold">wallet extension</span> will prompt for confirmation.
          </p>
        </div>
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

        <Button
          type="primary"
          className="mx-auto my-12 block h-[40px] w-[240px] rounded-full"
          onClick={onSwitchToTargetNetwork}
        >
          Switch to {contract.chain.name}
        </Button>
      </>
    )
  }

  function View2() {
    return (
      <>
        <div className="mt-6 rounded-2xl border border-[#FFFFFF1F] px-6 py-4 text-center">
          <ConnectedIcon className="mx-auto block size-[60px]" />
          <p className="mt-6 text-xl font-bold">Connected to {contract.chain.name}. Ready to create DlD</p>
          <p className="mt-2 text-base text-[#8D8D93]">Address: {shortenAddress(address, 8)}</p>
        </div>
        <Button
          type="primary"
          className="mx-auto my-12 block h-[40px] w-[240px] rounded-full"
          onClick={() => onNext(address as `0x${string}`)}
        >
          Continue
        </Button>
      </>
    )
  }

  return (
    <div className="mx-auto my-12 w-[612px] text-base">
      <h4 className="text-xl font-bold">Choose your EVM wallet</h4>
      {!isTargetNetwork ? <View1 /> : <View2 />}
    </div>
  )
}

export default ChooseEvmWalletView
