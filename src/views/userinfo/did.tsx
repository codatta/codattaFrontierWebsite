import { Button } from 'antd'
import { useMemo, useState } from 'react'

import CheckboxIcon from '@/assets/common/checkbox-circle-line.svg?react'
import ConnectedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import DoubleCheckIcon from '@/assets/userinfo/check-double-fill-icon.svg?react'
import WaitingIcon from '@/assets/userinfo/loader-line-icon-2.svg?react'
import PendingIcon from '@/assets/userinfo/loader-line-icon.svg?react'
import FailIcon from '@/assets/userinfo/close-line-icon.svg?react'

import { shortenAddress } from '@/utils/wallet-address'

export default function UserInfoDid() {
  const onBaseNetworkConnected = () => {}

  return (
    <div>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Register DID</h3>
      {/* <ChooseEvmWalletView onBaseNetworkConnected={onBaseNetworkConnected} /> */}
      <RegisterDidView />
    </div>
  )
}

function ChooseEvmWalletView({ onBaseNetworkConnected }: { onBaseNetworkConnected: () => void }) {
  const [address, setAddress] = useState('0x9fA1jljljeejjerlrjelrkj')
  const [network, setNetwork] = useState('Base')
  const isBaseNetwork = useMemo(() => network.toLocaleLowerCase() === 'base', [network])

  const onSwitchToBase = () => {
    setNetwork('Base')
  }

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
  const [view, setView] = useState<'view1' | 'view2'>('view1')

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
            <span>8453(0x2105)</span>
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
    <div className="mx-auto my-12 w-[612px] text-base">
      <h4 className="text-xl font-bold">Create DlD & Apply Authorization</h4>

      {view === 'view1' && <View1 />}
      {view === 'view2' && <View2 />}
    </div>
  )
}
