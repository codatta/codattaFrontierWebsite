import { Button, message, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { decodeEventLog, getAddress, PublicClient } from 'viem'
import { ExternalLink } from 'lucide-react'
import { useCodattaConnectContext } from 'codatta-connect'

import CheckboxIcon from '@/assets/common/checkbox-circle-line.svg?react'
import DoubleCheckIcon from '@/assets/userinfo/check-double-fill-icon.svg?react'
import WaitingIcon from '@/assets/userinfo/loader-line-icon-2.svg?react'
import PendingIcon from '@/assets/userinfo/loader-line-icon.svg?react'
import FailIcon from '@/assets/userinfo/close-line-icon.svg?react'

import { shortenAddress } from '@/utils/wallet-address'
import contract from '@/contracts/did-base-registrar.abi'
import registryContract from '@/contracts/did-base-registry.abi'
import accountApi from '@/apis/account.api'

export default function CreatDid({
  rpcClient,
  contractArgs,
  estimateGas,
  did,
  onNext
}: {
  rpcClient: PublicClient
  contractArgs: string[][]
  estimateGas: string
  did?: string
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [tip, setTip] = useState('')
  const [didIdentifier, setDidIdentifier] = useState<string>()
  const [txHash, setTxHash] = useState<string>('')
  const [step1Status, setStep1Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('waiting')
  const [step2Status, setStep2Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('pending')
  const { lastUsedWallet } = useCodattaConnectContext()
  const address = useMemo(() => {
    if (!lastUsedWallet) return ''
    return getAddress(lastUsedWallet.address!)
  }, [lastUsedWallet])

  const didShow = useMemo(() => {
    if (!didIdentifier) return ''

    return `did:codatta:0x${didIdentifier}`
  }, [didIdentifier])

  const createDid = useCallback(async () => {
    setLoading(true)
    if (!address) return

    try {
      console.log('Contract call params:', {
        account: address,
        contractAddress: contract.address,
        functionName: 'registerWithAuthorization',
        args: contractArgs,
        chain: contract.chain.name
      })

      const { request } = await rpcClient.simulateContract({
        account: address as `0x${string}`,
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: 'registerWithAuthorization',
        args: contractArgs,
        chain: contract.chain
      })

      setTip('Please check and approve the claim request in your wallet.')

      const tx = await lastUsedWallet?.client?.writeContract(request)
      setTip('Waiting for transaction to be confirmed...')
      if (!tx) throw new Error('Transaction failed')
      const receipt = await rpcClient.waitForTransactionReceipt({ hash: tx })

      // sync onchain status to backend
      const status = receipt.status === 'success' ? 2 : 3
      if (status === 2) {
        setStep1Status('success')
        setStep2Status('waiting')

        // Parse DIDRegistered event to get the generated DID
        if (receipt.logs && receipt.logs.length > 0) {
          try {
            let didRegisteredLog = null

            for (const log of receipt.logs) {
              try {
                const decodedLog = decodeEventLog({
                  abi: registryContract.abi,
                  data: log.data,
                  topics: log.topics
                })

                if (decodedLog.eventName === 'DIDRegistered') {
                  didRegisteredLog = decodedLog
                  break
                }
              } catch {
                // Skip logs that don't match our ABI
                continue
              }
            }

            if (didRegisteredLog) {
              const args = didRegisteredLog.args as unknown as { identifier: bigint; owner: string }
              const didIdentifier = args.identifier

              setDidIdentifier(didIdentifier.toString())
            } else {
              console.error('DIDRegistered event not found in transaction receipt')
              setStep1Status('failed')
            }
          } catch (error) {
            console.error('Error parsing logs:', error)
          }
        }

        setTxHash(receipt.transactionHash)
      }

      console.log('receipt', receipt)
    } catch (error) {
      console.error(error)
      message.error(error.details || error.message)
      setStep1Status('failed')
    } finally {
      setLoading(false)
    }
  }, [address, contractArgs, lastUsedWallet?.client, rpcClient])

  const bindDid = useCallback(async () => {
    if (!address) return
    if (!didIdentifier) return

    setLoading(true)
    try {
      const {
        data: { challenge }
      } = await accountApi.getDidChallenge()
      const { data } = await accountApi.bindDidAccount({
        did: didIdentifier!.toString(),
        signature: challenge,
        account: address
      })
      if (data.flag === 1) {
        setStep2Status('success')
      }
    } catch (error) {
      console.error(error)
      message.error(error.details || error.message)
      setStep2Status('failed')
    } finally {
      setLoading(false)
    }
  }, [address, didIdentifier])

  const onTryAgain = () => {
    if (step1Status === 'failed') {
      createDid()
    } else if (step2Status === 'failed') {
      bindDid()
    }
  }

  useEffect(() => {
    if (did) {
      setStep1Status('success')
      setStep2Status('success')
      setDidIdentifier(did)
    } else {
      if (!didIdentifier) {
        createDid()
      } else {
        bindDid()
      }
    }
  }, [didIdentifier, bindDid, createDid, did])

  return (
    <Spin spinning={loading} tip={tip} wrapperClassName="text-white">
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
            {didShow ? (
              <div className="flex flex-1 items-center justify-between">
                <span>{didShow}</span>
                {txHash && (
                  <a
                    href={`${contract.chain!.blockExplorers!.default.url}tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#875DFF]"
                  >
                    View on <ExternalLink color="#875DFF" size={18} />
                  </a>
                )}
              </div>
            ) : (
              <span>Transaction submitted, Waiting for on-chain confimation...</span>
            )}
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
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={onNext}>
          Done
        </Button>
      ) : (
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm opacity-30" type="primary">
          Preparing Binding...
        </Button>
      )}
    </Spin>
  )
}
