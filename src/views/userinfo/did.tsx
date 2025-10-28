import { Button, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPublicClient, http, stringToHex } from 'viem'

import CheckboxIcon from '@/assets/common/checkbox-circle-line.svg?react'
import DoubleCheckIcon from '@/assets/userinfo/check-double-fill-icon.svg?react'
import WaitingIcon from '@/assets/userinfo/loader-line-icon-2.svg?react'
import PendingIcon from '@/assets/userinfo/loader-line-icon.svg?react'
import FailIcon from '@/assets/userinfo/close-line-icon.svg?react'

import contract from '@/contracts/did-base-registrar.abi'
import accountApi from '@/apis/account.api'

import ChooseEvmWalletView from '@/components/settings/did/choose-evm-wallet'
import RegisterCheckGas from '@/components/settings/did/register-check-gas'

export default function UserInfoDid() {
  const [view, setView] = useState<'view1' | 'view2'>('view1')
  const [address, setAddress] = useState<`0x${string}`>('0x')

  const onBaseNetworkConnected = (address: `0x${string}`) => {
    setAddress(address)
    setView('view2')
  }

  return (
    <div>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Register DID</h3>
      {view === 'view1' ? (
        <ChooseEvmWalletView onBaseNetworkConnected={onBaseNetworkConnected} />
      ) : (
        <RegisterDidView address={address} />
      )}
    </div>
  )
}

function RegisterDidView({ address }: { address: `0x${string}` }) {
  const [view, setView] = useState<'view1' | 'view2'>('view1')
  const [loading, setLoading] = useState(false)
  const [contractArgs, setContractArgs] = useState<string[]>([])

  const getContractArgs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await accountApi.getAccountInfoForDidRegister()
      console.log(
        'res',
        res.data.map((item) => stringToHex(JSON.stringify(item)))
      )
      setContractArgs(res.data.map((item) => stringToHex(JSON.stringify(item))))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const rpcClient = useMemo(() => {
    return createPublicClient({
      chain: contract.chain,
      transport: http()
    })
  }, [])

  useEffect(() => {
    getContractArgs()
  }, [getContractArgs])

  function View2() {
    const [step1Status, setStep1Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('success')
    const [step2Status, setStep2Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('pending')

    const onTryAgain = () => {}
    const onDone = () => {}

    return (
      <>
        <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
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

        {view === 'view1' && <RegisterCheckGas address={address} rpcClient={rpcClient} contractArgs={contractArgs} />}
        {view === 'view2' && <View2 />}
      </div>
    </Spin>
  )
}
