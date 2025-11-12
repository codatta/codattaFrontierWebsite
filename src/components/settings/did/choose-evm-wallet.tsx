import { useCallback, useEffect, useState } from 'react'

import { Button, message, Modal, Popconfirm } from 'antd'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { base, mainnet, bsc, arbitrum, optimism, polygon, sepolia } from 'viem/chains'
import { getAddress } from 'viem'

import { shortenAddress } from '@/utils/wallet-address'

import contract from '@/contracts/did-base-registrar.abi'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import accountApi from '@/apis/account.api'

function ChooseEvmWalletView({ onNext }: { onNext: (address: `0x${string}`) => void }) {
  const [network, setNetwork] = useState('Unknown Network')
  const [address, setAddress] = useState('')
  const [showWallet, setShowWallet] = useState(false)
  const [open, setOpen] = useState(false)
  const [isTargetNetwork, setIsTargetNetwork] = useState(false)
  const { info } = useUserStore()

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

  const checkIsWalletAddressBinded = useCallback(
    (address: string) => {
      for (const asset of info?.accounts_data || []) {
        if (asset.account_type === 'block_chain' && asset.account === address) return true
      }
      return false
    },
    [info]
  )

  const checkIsCurrentWalletCanBind = useCallback(
    async (walletInfo: EmvWalletConnectInfo): Promise<boolean> => {
      const address = (await walletInfo.client.getAddresses())[0]
      if (checkIsWalletAddressBinded(address)) {
        console.log('checkIsCurrentWalletCanBind', 'is binded')
        return true
      }

      console.log('checkIsCurrentWalletCanBind', 'is not binded')

      try {
        await accountApi.bindEvmWallet({
          account_type: 'block_chain',
          connector: 'codatta_wallet',
          account_enum: 'C',
          chain: (await walletInfo.client.getChainId()).toString(),
          address: (await walletInfo.client.getAddresses())[0],
          signature: walletInfo.connect_info.signature,
          nonce: walletInfo.connect_info.nonce,
          wallet_name: walletInfo.connect_info.wallet_name,
          message: walletInfo.connect_info.message
        })
        await userStoreActions.getUserInfo()

        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [checkIsWalletAddressBinded]
  )

  const handleOnEvmWalletConnect = async (connectInfo: EmvWalletConnectInfo) => {
    setShowWallet(false)

    const isBinded = await checkIsCurrentWalletCanBind(connectInfo)
    if (isBinded) {
      getWalletInfo()
    } else {
      await message
        .error('This wallet account is already linked to another account. Please try a different one.')
        .then(() => {
          setShowWallet(true)
        })
    }
    console.log('handleOnEvmWalletConnect', connectInfo)
  }

  const onConfirm = () => {
    setOpen(false)
    onSwitchToTargetNetwork()
  }

  const onConfirmCancel = () => {
    setOpen(false)
  }
  const handleNext = () => {
    setOpen(true)
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
            Switch Wallet
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
            <Popconfirm
              title={`Switch to ${contract.chain.name}`}
              description="Are you sure to switch to this network?"
              open={open}
              onConfirm={onConfirm}
              onCancel={onConfirmCancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" className="block h-[40px] w-[240px] rounded-full font-medium" onClick={handleNext}>
                Next
              </Button>
            </Popconfirm>
          )}
        </div>
      </>
    )
  }

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
          header={<h4 className="mb-6 text-xl font-bold">Choose your EVM wallet</h4>}
        ></CodattaConnect>
      </Modal>
    </div>
  )
}

export default ChooseEvmWalletView
