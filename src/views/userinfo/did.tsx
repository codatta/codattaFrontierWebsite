import { Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPublicClient, http, stringToHex } from 'viem'

import contract from '@/contracts/did-base-registrar.abi'
import accountApi from '@/apis/account.api'

import ChooseEvmWalletView from '@/components/settings/did/choose-evm-wallet'
import CheckGas from '@/components/settings/did/register-check-gas'
import CreateDid from '@/components/settings/did/register-create-did'

export default function UserInfoDid() {
  const [view, setView] = useState<'view1' | 'view2' | 'view3'>('view1')
  const [address, setAddress] = useState<`0x${string}`>('0x')
  const [estimateGas, setEstimateGas] = useState('')
  const [loading, setLoading] = useState(false)
  const [contractArgs, setContractArgs] = useState<string[][]>([])

  const getContractArgs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await accountApi.getAccountInfoForDidRegister()
      setContractArgs([res.data.map((item) => stringToHex(JSON.stringify(item)))])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const rpcClient = useMemo(() => {
    const rpcUrl = contract?.chain.rpcUrls.default.http[0]

    return createPublicClient({
      chain: contract.chain,
      transport: http(rpcUrl)
    })
  }, [])

  const onBaseNetworkConnected = (address: `0x${string}`) => {
    setAddress(address)
    setView('view2')
  }

  const onGasChecked = ({ estimateGas }: { estimateGas: string }) => {
    setEstimateGas(estimateGas)
    setView('view3')
  }

  const onRegisterSuccess = () => {}

  useEffect(() => {
    getContractArgs()
  }, [getContractArgs])

  return (
    <Spin spinning={loading}>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Register DID</h3>
      {view === 'view1' && <ChooseEvmWalletView onNext={onBaseNetworkConnected} />}
      {view === 'view2' && (
        <CheckGas address={address} rpcClient={rpcClient} contractArgs={contractArgs} onNext={onGasChecked} />
      )}
      {view === 'view3' && (
        <CreateDid
          address={address}
          rpcClient={rpcClient}
          contractArgs={contractArgs}
          estimateGas={estimateGas}
          onNext={onRegisterSuccess}
        />
      )}
    </Spin>
  )
}
