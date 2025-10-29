import { Button, message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { decodeEventLog, PublicClient } from 'viem'
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
  address,
  rpcClient,
  contractArgs,
  onNext,
  estimateGas
}: {
  address: `0x${string}`
  rpcClient: PublicClient
  contractArgs: string[][]
  estimateGas: string
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [tip, setTip] = useState('')
  const [did, setDid] = useState('did:kiteai-testnet:338923617616767100494389508643837036386')
  const [txHash, setTxHash] = useState('0x8ad76b144e3b4ec1d037fb320ba24f3b18dabae32179052ab8d50529b05da5e5')
  const [step1Status, setStep1Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('waiting')
  const [step2Status, setStep2Status] = useState<'pending' | 'waiting' | 'success' | 'failed'>('pending')
  const { lastUsedWallet } = useCodattaConnectContext()

  const createDid = async () => {
    setLoading(true)
    try {
      const { request } = await rpcClient.simulateContract({
        account: address,
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
              const didOwner = args.owner

              // Get chain name from contract config and normalize it for DID method
              const chainName = contract.chain.name.toLowerCase().replace(/\s+/g, '-')

              // Construct full DID in standard format
              const fullDID = `did:${chainName}:${didIdentifier.toString()}`
              const fullDIDHex = `did:${chainName}:0x${didIdentifier.toString(16)}`

              console.log('✅ DID Generated Successfully!')
              console.log('Chain:', contract.chain.name)
              console.log('DID Identifier (decimal):', didIdentifier.toString())
              console.log('DID Identifier (hex):', `0x${didIdentifier.toString(16)}`)
              console.log('Full DID (decimal):', fullDID)
              console.log('Full DID (hex):', fullDIDHex)
              console.log('DID Owner:', didOwner)
              console.log('Full event data:', didRegisteredLog)

              setDid(fullDID)
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
  }

  const onTryAgain = () => {
    if (step1Status === 'failed') {
      createDid()
    }
  }
  const onDone = () => {}

  useEffect(() => {
    createDid()
  }, [])

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
            {did ? (
              <div className="flex flex-1 items-center justify-between">
                <span>{did}</span>
                <a
                  href={`${contract.chain!.blockExplorers!.default.url}tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[#875DFF]"
                >
                  View on <ExternalLink color="#875DFF" size={18} />
                </a>
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
        <Button className="mx-auto mt-12 block w-[240px] rounded-full text-sm" type="primary" onClick={onDone}>
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
