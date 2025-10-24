import { Button, Modal, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

import CheckboxIcon from '@/assets/common/checkbox-circle-line.svg?react'
import ConnectedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import DoubleCheckIcon from '@/assets/userinfo/check-double-fill-icon.svg?react'
import WaitingIcon from '@/assets/userinfo/loader-line-icon-2.svg?react'
import PendingIcon from '@/assets/userinfo/loader-line-icon.svg?react'
import FailIcon from '@/assets/userinfo/close-line-icon.svg?react'

import { shortenAddress } from '@/utils/wallet-address'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { createPublicClient, formatEther, getAddress, http } from 'viem'
import { base, mainnet, bsc, arbitrum, optimism, polygon, sepolia } from 'viem/chains'
import contract from '@/contracts/did-base-registrar.abi'

export default function UserInfoDid() {
  const [view, setView] = useState<'view1' | 'view2'>('view1')
  const onBaseNetworkConnected = () => {
    setView('view2')
  }

  return (
    <div>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Register DID</h3>
      {view === 'view1' ? <ChooseEvmWalletView onBaseNetworkConnected={onBaseNetworkConnected} /> : <RegisterDidView />}
    </div>
  )
}

function ChooseEvmWalletView({ onBaseNetworkConnected }: { onBaseNetworkConnected: () => void }) {
  const [network, setNetwork] = useState('')
  const [address, setAddress] = useState('')
  const [showWallet, setShowWallet] = useState(false)
  const isBaseNetwork = useMemo(() => network.toLocaleLowerCase() === 'base', [network])

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

      const supportedChains = [mainnet, base, bsc, arbitrum, optimism, polygon, sepolia]
      const currentChain = supportedChains.find((chain) => chain.id === chainId)

      if (currentChain) {
        setNetwork(currentChain.name)
      } else {
        setNetwork('Unknown Network')
      }
    } catch (error) {
      console.error(error)
    }

    console.log('chainId', base.id, base.name)
  }, [lastUsedWallet])

  const onSwitchToBase = async () => {
    const res = await lastUsedWallet?.switchChain(base)
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
            DlD can be created on <span className="font-bold">Base</span> only, Your{' '}
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

        <Button type="primary" className="mx-auto my-12 block h-[40px] w-[240px] rounded-full" onClick={onSwitchToBase}>
          Switch to Base
        </Button>
      </>
    )
  }

  function View2() {
    return (
      <>
        <div className="mt-6 rounded-2xl border border-[#FFFFFF1F] px-6 py-4 text-center">
          <ConnectedIcon className="mx-auto block size-[60px]" />
          <p className="mt-6 text-xl font-bold">Connected to Base. Ready to create DlD</p>
          <p className="mt-2 text-base text-[#8D8D93]">Address: {shortenAddress(address, 8)}</p>
        </div>
        <Button
          type="primary"
          className="mx-auto my-12 block h-[40px] w-[240px] rounded-full"
          onClick={onBaseNetworkConnected}
        >
          Continue
        </Button>
      </>
    )
  }

  return (
    <div className="mx-auto my-12 w-[612px] text-base">
      <h4 className="text-xl font-bold">Choose your EVM wallet</h4>
      {!isBaseNetwork ? <View1 /> : <View2 />}
    </div>
  )
}

function RegisterDidView() {
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'view1' | 'view2'>('view1')
  const [balance, setBalance] = useState<string>()
  const { lastUsedWallet } = useCodattaConnectContext()
  const address = useMemo(() => (lastUsedWallet?.address ? getAddress(lastUsedWallet.address) : ''), [lastUsedWallet])
  const rpcClient = useMemo(() => {
    const rpcUrl = contract?.chain.rpcUrls.default.http[0]

    return createPublicClient({
      chain: base,
      transport: http(rpcUrl)
    })
  }, [])

  const getBalance = useCallback(
    async (address: `0x${string}`) => {
      if (!address) return
      const balance = await rpcClient.getBalance({
        address
      })
      const balanceStr = formatEther(balance)

      console.log('balance', balanceStr)
      setBalance(balanceStr)
    },
    [rpcClient]
  )

  useEffect(() => {
    if (!address) return
    getBalance(address)
  }, [address, getBalance])

  function CommonView() {
    return (
      <>
        <p>
          This will send a transaction on <span className="font-bold">Base</span> and incur gas.
        </p>
        <p className="font-bold"> Do you want to continue?</p>
        <div className="mt-6 rounded-2xl bg-[#1C1C26] px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Owner地址</span>
            <span>{shortenAddress(address, 8)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Gas预估</span>
            <span>8453(0x2105)</span>
          </div>
        </div>
      </>
    )
  }

  function View1() {
    return (
      <>
        <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
          <CommonView />
        </div>
        <Button
          className="mx-auto mt-12 block w-[240px] rounded-full text-sm"
          type="primary"
          onClick={() => setView('view2')}
        >
          Continue
        </Button>
      </>
    )
  }

  function View2() {
    const [step1Status, setStep1Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('success')
    const [step2Status, setStep2Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('pending')

    const onTryAgain = () => {}
    const onDone = () => {}

    return (
      <>
        <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
          <CommonView />
          <div className="mt-6 rounded-2xl bg-[#1C1C26] px-5 py-4">
            {/* step1  */}
            <h4 className="flex items-center gap-2 text-lg font-bold">
              {step1Status === 'waiting' && <WaitingIcon />}
              {step1Status === 'pending' && <PendingIcon />}
              {step1Status === 'success' && <DoubleCheckIcon />}
              {step1Status === 'failed' && <FailIcon />}
              On-chain transaction
            </h4>
            <p className="mt-[6px] flex items-center gap-2 text-sm text-[#77777D]">
              <div className="mx-2 h-[40px] w-px bg-[#FFFFFF1F]" />
              Transaction submitted, Waiting for on-chain confimation...
            </p>
            {/* step2 */}
            <h4 className="mt-2 flex items-center gap-2 text-lg font-bold">
              {step2Status === 'waiting' && <WaitingIcon />}
              {step2Status === 'pending' && <PendingIcon />}
              {step2Status === 'success' && <DoubleCheckIcon />}
              {step2Status === 'failed' && <FailIcon />}
              Account binding
            </h4>
            <p className="mt-[6px] flex items-center gap-2 text-sm text-[#77777D]">
              <div className="mx-2 h-[40px] w-px" />
              Approve the binding authorization in your wallet...
            </p>
          </div>
          {step2Status === 'success' && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#5DDD2214] p-3 text-[#5DDD22]">
              <CheckboxIcon className="size-6" />
              <span>DlD registered. Your account is now bound.</span>
            </div>
          )}
        </div>
        {[step1Status, step2Status].includes('failed') ? (
          <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={onTryAgain}>
            Try again
          </Button>
        ) : step2Status === 'success' ? (
          <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={onDone}>
            Done
          </Button>
        ) : (
          <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm opacity-30" type="primary">
            Preparing Binding...
          </Button>
        )}
      </>
    )
  }

  return (
    <Spin spinning={loading}>
      <div className="mx-auto my-12 w-[612px] text-base">
        <h4 className="text-xl font-bold">Create DlD & Apply Authorization</h4>

        {view === 'view1' && <View1 />}
        {view === 'view2' && <View2 />}
      </div>
    </Spin>
  )
}
