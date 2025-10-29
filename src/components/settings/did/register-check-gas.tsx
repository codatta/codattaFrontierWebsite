import { getAddress, PublicClient } from 'viem'

import { Button, Spin } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { shortenAddress } from '@/utils/wallet-address'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import contract from '@/contracts/did-base-registrar.abi'
import { useCodattaConnectContext } from 'codatta-connect'
import { useMemo } from 'react'

function RegisterCheckGas({
  rpcClient,
  contractArgs,
  onNext
}: {
  rpcClient: PublicClient
  contractArgs: string[][]
  onNext: ({ balance, estimateGas }: { balance: string; estimateGas: string }) => void
}) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const address = useMemo(() => {
    if (!lastUsedWallet) return ''
    return getAddress(lastUsedWallet.address!)
  }, [lastUsedWallet])
  const { loading, balance, estimateGas, gasWarning } = useGasEstimation({
    address: address as `0x${string}`,
    rpcClient,
    contractArgs
  })

  return (
    <Spin spinning={loading}>
      <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
        <p>
          This will send a transaction on <span className="font-bold">{contract.chain.name}</span> and incur gas.
        </p>
        <p className="font-bold"> Do you want to continue?</p>
        <div className="mt-6 rounded-2xl bg-[#1C1C26] px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Owner地址</span>
            <span>{shortenAddress(address, 8)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Gas预估</span>
            <span>{estimateGas}</span>
          </div>
        </div>
        {gasWarning && (
          <div className="flex gap-3 p-3 text-sm text-[#D92B2B]">
            <div>
              <InfoCircleOutlined className="text-lg"></InfoCircleOutlined>
            </div>
            <p>Balance insufficient to cover gas. Please top up and try again.</p>
          </div>
        )}
      </div>

      {gasWarning ? (
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={() => {}}>
          Back
        </Button>
      ) : (
        <Button
          className="mx-auto mt-12 block w-[240px] rounded-full text-sm"
          type="primary"
          onClick={() => onNext({ balance, estimateGas })}
        >
          Continue
        </Button>
      )}
    </Spin>
  )
}

export default RegisterCheckGas
