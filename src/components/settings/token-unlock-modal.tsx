import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Spin } from 'antd'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ExternalLink } from 'lucide-react'
import { useCodattaConnectContext } from 'codatta-connect'

import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useContractWrite } from '@/hooks/use-contract-write'

import LockRewardContract from '@/contracts/lockup-reward.abi'
import { STAKE_ASSET_TYPE } from '@/contracts/staking.abi'
import { shortenAddress } from '@/utils/wallet-address'
import { formatNumber } from '@/utils/str'

import SuccessIcon from '@/assets/frontier/crypto/pc-approved-icon.svg'

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function InfoItemLoading(props: { loading: boolean; children: React.ReactNode }) {
  if (props.loading) {
    return <Loader2 className="animate-spin" />
  }
  return props.children
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

interface UnlockConfirmProps {
  tokenIds: string[]
  tokens: Array<{ name: string; amount: string | number }>
  onClose: () => void
  onSuccess: (hash: string) => void
}

function UnlockConfirm({ tokenIds, tokens, onClose, onSuccess }: UnlockConfirmProps) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [errorMsg, setErrorMsg] = useState('')

  // 1. Contract Args: [uids]
  const contractArgs = useMemo(() => {
    return [tokenIds]
  }, [tokenIds])

  console.log('contractArgs 222:', contractArgs)
  // 2. Hooks: Gas & Write
  const {
    balance,
    estimateGas: gasFee,
    gasWarning,
    loading: gasLoading
  } = useGasEstimation({
    address: lastUsedWallet?.address as `0x${string}`,
    contract: LockRewardContract,
    functionName: 'unlock',
    contractArgs
  })

  console.log('lastUsedWallet?', lastUsedWallet?.address)
  const {
    writeContract,
    isLoading: isWriting,
    tip: writeTip
  } = useContractWrite({
    onStepChange: async (step, data) => {
      switch (step) {
        case 'writing':
          console.log('Unlocking...')
          setErrorMsg('')
          break
        case 'confirming':
          console.log('Transaction confirming...', data)
          break
        case 'success':
          console.log('Transaction successful!')
          if (data && (data as { hash: string }).hash) {
            onSuccess((data as { hash: string }).hash)
          } else {
            onSuccess('')
          }
          break
        case 'error':
          console.log('Transaction failed!')
          setErrorMsg('Transaction failed')
          setTimeout(() => {
            onClose()
          }, 3000)
          break
      }
    }
  })

  // 3. Action: Confirm Unlock
  const handleConfirm = useCallback(async () => {
    if (!gasFee) return

    try {
      setErrorMsg('')
      await writeContract({
        contract: LockRewardContract,
        functionName: 'unlock',
        args: contractArgs
      })
    } catch (err: unknown) {
      console.error(err)
      const msg = (err as Error).message || 'Transaction failed'
      setErrorMsg(msg)
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }, [gasFee, writeContract, contractArgs, onClose])

  const isLoading = gasLoading
  const hasGasWarning = !!gasWarning

  return (
    <Spin spinning={isWriting} tip={writeTip}>
      <div className="p-6 text-base">
        <div className="mb-6 text-lg font-bold text-white">Claim all</div>

        <div className="mb-6 space-y-6 text-base text-[#8D8D93]">
          <div className="flex items-center justify-between">
            <span>Network</span>
            <span className="text-white">{LockRewardContract.chain.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Receiving Wallet Address</span>
            <span className="text-white">{shortenAddress(lastUsedWallet?.address || '', 12)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Balance(for gas)</span>
            <span className={hasGasWarning ? 'text-[#D92B2B]' : 'text-white'}>
              <InfoItemLoading loading={isLoading && !balance}>
                {balance ? Number(balance).toFixed(4) : '--'} {LockRewardContract.chain.nativeCurrency.symbol}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Gas Fee</span>
            <span className={hasGasWarning ? 'text-[#D92B2B]' : 'text-white'}>
              <InfoItemLoading loading={isLoading && !gasFee}>
                {gasFee || '--'} {LockRewardContract.chain.nativeCurrency.symbol}
              </InfoItemLoading>
            </span>
          </div>
        </div>

        {/* Lock Amount Box - Modified for Unlock */}
        <div className="mb-6 rounded-2xl bg-[#1C1C26] p-4">
          <div className="mb-3 flex items-center justify-between border-b border-[#FFFFFF1F] pb-2 text-lg font-bold">
            <span className="text-white">To Claim</span>
            <div className="text-base text-[#FFA800]">
              {tokens.map((asset, index) => (
                <div key={index} className={Number(asset.amount) === 0 ? 'hidden' : ''}>
                  <span className="mr-1 font-bold">{asset.amount}</span>
                  <span>{asset.name}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm leading-5 text-[#77777D]">
            These rewards will be locked in a 3-month lock-up contract (T+90). After they unlock, you can claim them on
            the "Lock-up" page and they will be sent directly to your wallet.
          </p>
        </div>

        {gasWarning && (
          <div className="mb-6 flex gap-3 rounded-xl border border-[#D92B2B]/20 bg-[#D92B2B]/10 p-3 text-sm text-[#D92B2B]">
            <InfoCircleOutlined className="mt-0.5 text-lg" />
            <p>{gasWarning}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 flex items-center justify-center gap-2 text-[#D92B2B]">
            <InfoCircleOutlined />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="text"
            className="h-10 w-[120px] rounded-full text-white hover:text-white/80"
            onClick={onClose}
            disabled={isWriting}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="min-w-[140px] rounded-full bg-[#875DFF] hover:bg-[#754DEB] disabled:opacity-50"
            onClick={handleConfirm}
            loading={isWriting}
            disabled={!!gasWarning || isLoading}
          >
            {gasLoading ? 'Calculating Gas...' : 'Confirm Claim'}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

function UnlockSuccess({ txHash, onClose, amount }: { txHash: string; onClose: () => void; amount: number }) {
  const navigate = useNavigate()

  const handleConfirm = () => {
    navigate('/app/settings/data-assets?tab=claim-history-tab')
    onClose()
  }
  return (
    <div className="p-6 text-base">
      <div className="mb-6 text-lg font-bold text-white">Claim completed</div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#FFFFFF1F] bg-[#252532] px-4 py-10">
        <img src={SuccessIcon} alt="Success" className="mb-6 size-[72px]" />

        <p className="mb-2 max-w-[340px] text-center text-white">
          {formatNumber(amount, 2)} {STAKE_ASSET_TYPE} has been returned to your wallet. You can find the record in
          Staking History.
        </p>

        {txHash && (
          <a
            href={`${LockRewardContract.chain.blockExplorers?.default.url}tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 flex items-center gap-1 text-[#875DFF] hover:text-[#A78BFA]"
          >
            TX: {shortenAddress(txHash, 8)} <ExternalLink className="size-4" />
          </a>
        )}

        <Button
          shape="round"
          size="large"
          type="primary"
          className="h-[42px] bg-white px-6 text-[#1C1C26] hover:!bg-black/80 hover:text-white"
          onClick={handleConfirm}
        >
          View History
        </Button>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Main Component (Container)
// ----------------------------------------------------------------------

interface TokenUnlockModalProps {
  open: boolean
  onClose: () => void
  tokenIds: string[]
  tokens: Array<{ name: string; amount: string | number }>
}

export default function TokenUnlockModal(props: TokenUnlockModalProps) {
  const [viewState, setViewState] = useState<'confirm' | 'success'>('confirm')
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    if (!props.open) {
      // Reset internal state when modal closes
      setTimeout(() => {
        setViewState('confirm')
        setTxHash('')
      }, 300)
    }
  }, [props.open])

  const handleSuccess = (hash: string) => {
    setTxHash(hash)
    setViewState('success')
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onClose}
      width={600}
      footer={null}
      styles={{ content: { padding: 0, backgroundColor: '#252532', color: 'white' } }}
      centered
      destroyOnHidden
      maskClosable={false}
      closable={viewState !== 'confirm'}
      closeIcon={<span className="text-white/60 hover:text-white">✕</span>}
    >
      {viewState === 'confirm' && (
        <UnlockConfirm
          tokenIds={props.tokenIds}
          tokens={props.tokens}
          onClose={props.onClose}
          onSuccess={handleSuccess}
        />
      )}

      {viewState === 'success' && (
        <UnlockSuccess
          txHash={txHash}
          onClose={props.onClose}
          amount={props.tokens.reduce((acc, cur) => acc + Number(cur.amount), 0)}
        />
      )}
    </Modal>
  )
}
