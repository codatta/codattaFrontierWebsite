import { useState, useEffect, useCallback, useMemo } from 'react'
import { Abi, Chain, encodeFunctionData, formatEther, PublicClient } from 'viem'

import { Button, Spin } from 'antd'

import contract from '@/contracts/did-base-registrar.abi'
import { shortenAddress } from '@/utils/wallet-address'
import { InfoCircleOutlined } from '@ant-design/icons'

function RegisterCheckGas({
  address,
  rpcClient,
  contractArgs
}: {
  address: `0x${string}`
  rpcClient: PublicClient
  contractArgs: string[]
}) {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<string>('0')
  const [estimateGas, setEstimateGas] = useState<string>('0')
  const [gasWarning, setGasWarning] = useState('')

  const checkGas = useCallback(async () => {
    const getBalance = async (address: `0x${string}`) => {
      if (!address) return
      const balance = await rpcClient.getBalance({
        address
      })
      const balanceStr = formatEther(balance)

      console.log('balance', balanceStr)
      setBalance(balanceStr)
      return balanceStr
    }

    const getEstimateGas = async (contract: { abi: Abi; chain: Chain; address: string }, address: `0x${string}`) => {
      if (!address) return

      try {
        const estimateGas = await rpcClient.estimateGas({
          account: address,
          to: contract.address as `0x${string}`,
          data: encodeFunctionData({
            abi: contract.abi,
            functionName: 'registerWithAuthorization',
            args: contractArgs
          })
        })
        const estimateGasStr = formatEther(estimateGas)
        setEstimateGas(estimateGasStr)
        return estimateGasStr
      } catch (error) {
        console.error(error)
        setEstimateGas('0') // TODO
        return '0'
      }
    }

    try {
      if (!address || !rpcClient || !contractArgs.length) return

      setLoading(true)
      const balance = await getBalance(address)
      const estimateGas = await getEstimateGas(contract, address)

      if (balance && estimateGas) {
        if (Number(balance) < Number(estimateGas)) {
          setGasWarning('Balance insufficient to cover gas. Please top up and try again.')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [address, rpcClient, contractArgs])

  useEffect(() => {
    checkGas()
  }, [checkGas])

  return (
    <Spin spinning={loading}>
      <div className="mt-6 rounded-2xl bg-[#875DFF1A] p-6">
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
            <span>{estimateGas}</span>
          </div>
        </div>
        {gasWarning && (
          <div className="flex gap-3 p-3 text-sm text-[#D92B2B]">
            <div>
              <InfoCircleOutlined className="text-lg"></InfoCircleOutlined>
            </div>
            <p>BNB balance insufficient to cover gas. Please top up and try again.</p>
          </div>
        )}
      </div>

      {gasWarning ? (
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={() => {}}>
          Back
        </Button>
      ) : (
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={() => {}}>
          Continue
        </Button>
      )}
    </Spin>
  )
}

export default RegisterCheckGas
