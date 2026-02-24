import { getAddress, PublicClient } from 'viem'

import { Button, Spin } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { shortenAddress } from '@/utils/format'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import contract from '@/contracts/did-base-registrar.abi'
import { useCodattaConnectContext } from 'codatta-connect'
import { useMemo } from 'react'

function RegisterCheckGas({
  rpcClient,
  contractArgs,
  onNext,
  onBack
}: {
  rpcClient: PublicClient
  contractArgs: string[][]
  onNext: ({ balance, estimateGas }: { balance: string; estimateGas: string }) => void
  onBack: () => void
}) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const address = useMemo(() => {
    if (!lastUsedWallet) return ''
    return getAddress(lastUsedWallet.address!)
  }, [lastUsedWallet])
  const { loading, balance, estimateGas, gasLimit, gasWarning } = useGasEstimation({
    address: address as `0x${string}`,
    rpcClient,
    contract,
    functionName: 'registerWithAuthorization',
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
            <span className="text-sm text-[#BBBBBE]">Owner Address</span>
            <span>{shortenAddress(address, 8)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Gas Limit</span>
            <span>{gasLimit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#BBBBBE]">Gas Estimation</span>
            <span>
              {estimateGas} {contract?.chain.nativeCurrency.symbol}
            </span>
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
      <div className="my-12 flex items-center justify-center gap-4">
        <Button
          className="block h-[40px] w-[240px] rounded-full bg-white text-sm font-medium text-black"
          type="default"
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          className="block h-[40px] w-[240px] rounded-full text-sm font-medium"
          type="primary"
          onClick={() => onNext({ balance, estimateGas })}
        >
          Continue
        </Button>
      </div>
    </Spin>
  )
}

export default RegisterCheckGas
