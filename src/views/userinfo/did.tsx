import { Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPublicClient, http, stringToHex } from 'viem'

import contract from '@/contracts/did-base-registrar.abi'
import accountApi from '@/apis/account.api'

import ChooseEvmWalletView from '@/components/settings/did/choose-evm-wallet'
import CheckGas from '@/components/settings/did/register-check-gas'
import CreateDid from '@/components/settings/did/register-create-did'
import { useUserStore } from '@/stores/user.store'

export default function UserInfoDid() {
  const [view, setView] = useState<'view1' | 'view2' | 'view3'>('view1')
  const [estimateGas, setEstimateGas] = useState('0')
  const [loading, setLoading] = useState(false)
  const [contractArgs, setContractArgs] = useState<string[][]>([])
  const { info } = useUserStore()

  const getContractArgs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await accountApi.getAccountInfoForDidRegister()
      console.log('Backend response:', res.data)
      const authorizations = res.data.map((item) => stringToHex(JSON.stringify(item)))
      console.log('Converted authorizations:', authorizations)
      setContractArgs([authorizations])
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

  const onBaseNetworkConnected = () => {
    setView('view2')
  }

  const onGasChecked = ({ estimateGas }: { estimateGas: string }) => {
    setEstimateGas(estimateGas)
    setView('view3')
  }

  const onRegisterSuccess = () => {
    window.history.back()
  }

  useEffect(() => {
    getContractArgs()
  }, [getContractArgs])

  useEffect(() => {
    if (info?.user_data?.did) {
      setView('view3')
    }
  }, [info?.user_data?.did])

  return (
    <Spin spinning={loading}>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Create DID & Apply Authorization</h3>
      {view === 'view1' && <ChooseEvmWalletView onNext={onBaseNetworkConnected} />}
      {view === 'view2' && (
        <CheckGas
          rpcClient={rpcClient}
          contractArgs={contractArgs}
          onNext={onGasChecked}
          onBack={() => setView('view1')}
        />
      )}
      {view === 'view3' && (
        <CreateDid
          did={info?.user_data.did}
          rpcClient={rpcClient}
          contractArgs={contractArgs}
          estimateGas={estimateGas}
          onNext={onRegisterSuccess}
          onBack={() => setView('view1')}
        />
      )}
    </Spin>
  )
}
