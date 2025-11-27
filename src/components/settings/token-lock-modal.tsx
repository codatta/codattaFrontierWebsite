import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Spin, message } from 'antd'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { Loader2 } from 'lucide-react'
import { keccak256, stringToHex, parseEther } from 'viem'

import userApi, { ClaimableReward, RewardClaimSignResponse } from '@/apis/user.api'
import { shortenAddress } from '@/utils/wallet-address'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useContractWrite } from '@/hooks/use-contract-write'
import LockRewardContract from '@/contracts/lock-claim-reward.abi'
import { TOKEN_CONTRACT_ADDRESS } from './config'

import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function getAssetIcon(type: string) {
  if (type === 'USDT') return <USDTIcon />
  if (type === 'XNY' || type === 'XnYCoin') return <XnyIcon />
  return null
}

function InfoItemLoading(props: { loading: boolean; children: React.ReactNode }) {
  if (props.loading) {
    return <Loader2 className="animate-spin" />
  }
  return props.children
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function SelectToken(props: { onSelect: (asset: ClaimableReward) => void; assets: ClaimableReward[] }) {
  console.log('assets 2', props.assets)
  return (
    <div className="p-6">
      <div className="mb-6 text-lg font-bold text-white">Select Token to Lock</div>
      <div className="grid grid-cols-1 gap-2">
        {props.assets?.length === 0 && <div className="py-8 text-center text-[#8D8D93]">No lockable assets found.</div>}
        {props.assets?.map((asset) => (
          <div
            key={asset.batch_ids}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6 hover:border-primary"
            onClick={() => props.onSelect(asset)}
          >
            <div className="flex items-center gap-3">
              {getAssetIcon(asset.asset_type)}
              <span className="text-lg font-bold text-white">{asset.name}</span>
            </div>
            <div className="text-right">
              <div className="mb-1 text-[28px] font-bold">{asset.amount}</div>
              <div className="text-base text-[#BBBBBE]">{asset.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LockConfirmProps {
  asset: ClaimableReward
  onClose: () => void
  onSuccess: () => void
}

function LockConfirm({ asset, onClose, onSuccess }: LockConfirmProps) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [signData, setSignData] = useState<RewardClaimSignResponse | null>(null)
  const [preparing, setPreparing] = useState(false)

  // 1. Prepare: Get Signature
  useEffect(() => {
    async function fetchSignature() {
      if (!lastUsedWallet?.address) return

      const tokenAddress = TOKEN_CONTRACT_ADDRESS[asset.asset_type]
      if (!tokenAddress) {
        message.error('Token contract address not found')
        return
      }

      setPreparing(true)
      try {
        const signRes = await userApi.getRewardClaimSign({
          address: lastUsedWallet.address,
          amount: asset.amount.toString(),
          chain_id: LockRewardContract.chain.id.toString(),
          token: tokenAddress,
          reward_type: asset.asset_type
        })
        setSignData({
          ...signRes,
          amount: signRes.amount.toString()
        })
      } catch (err: unknown) {
        console.error(err)
        message.error((err as Error).message || 'Failed to prepare lock transaction')
      } finally {
        setPreparing(false)
      }
    }

    fetchSignature()
  }, [asset, lastUsedWallet?.address, onClose])

  // 2. Contract Args
  const contractArgs = useMemo(() => {
    // If no signData, return empty to prevent useGasEstimation from calling RPC with bad data
    if (!signData) return []

    // Calculate release time (T+90 days) - This might need to come from API if signed
    const releaseTime = BigInt(Math.floor(Date.now() / 1000) + 90 * 24 * 3600)

    return [
      keccak256(stringToHex(signData.uid)),
      signData.token,
      parseEther(signData.amount.toString()),
      releaseTime,
      signData.expired_at,
      `0x${signData.signature}`
    ]
  }, [signData])

  // 3. Hooks: Gas & Write
  console.log('contractArgs', contractArgs)
  const {
    balance,
    estimateGas: gasFee,
    gasWarning,
    loading: gasLoading
  } = useGasEstimation({
    address: lastUsedWallet?.address as `0x${string}`,
    contract: LockRewardContract,
    functionName: 'lock',
    contractArgs
  })

  const { writeContract, isLoading: isWriting, tip: writeTip } = useContractWrite()

  // 4. Action: Confirm Lock
  const handleConfirm = useCallback(async () => {
    if (!signData || !gasFee) return

    try {
      // Create Record
      await userApi.createRewardRecord(signData.uid, gasFee)

      // Write Contract
      let hash
      try {
        const res = await writeContract({
          contract: LockRewardContract,
          functionName: 'lock', //
          args: contractArgs
        })
        hash = res.hash
      } catch (writeErr) {
        await userApi.finishRewardRecord(signData.uid, 4) // Cancel
        throw writeErr
      }

      // Update & Finish Record
      await userApi.updateRewardRecord(signData.uid, hash)
      await userApi.finishRewardRecord(signData.uid, 2) // Success

      onSuccess()
    } catch (err: unknown) {
      console.error(err)
      message.error((err as Error).message || 'Transaction failed')
    }
  }, [signData, gasFee, writeContract, contractArgs, onSuccess])

  const isLoading = preparing || gasLoading
  const btnText = isWriting ? <Loader2 className="animate-spin" /> : 'Confirm Lock'
  const hasGasWarning = !!gasWarning

  return (
    <Spin spinning={isWriting} tip={writeTip}>
      <div className="p-6 text-base">
        <div className="mb-6 text-lg font-bold text-white">Lock now</div>

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

        {/* Lock Amount Box */}
        <div className="mb-6 rounded-2xl bg-[#1C1C26] p-4">
          <div className="mb-3 flex items-center justify-between border-b border-[#FFFFFF1F] pb-2 text-lg font-bold">
            <span className="text-white">To lock</span>
            <span className="text-[#FFA800]">
              {asset.amount} <span className="font-normal">{asset.name}</span>
            </span>
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
            disabled={!!gasWarning || isLoading || !signData}
          >
            {btnText}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

function LockSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center p-6 text-base">
      <img src={SuccessIcon} alt="" className="mb-4 size-[80px]" />
      <div className="mb-6 text-center text-lg font-bold text-white">Lock Success</div>
      <p className="mb-6 text-center text-[#8D8D93]">
        Your assets have been successfully locked for 3 months. You can check the details in the Lock-up page.
      </p>
      <Button shape="round" size="large" type="primary" className="w-[120px]" onClick={onClose}>
        Got it
      </Button>
    </div>
  )
}

// ----------------------------------------------------------------------
// Main Component (Container)
// ----------------------------------------------------------------------

interface TokenLockModalProps {
  open: boolean
  onClose: () => void
  assets: ClaimableReward[]
}

export default function TokenLockModal(props: TokenLockModalProps) {
  const [viewState, setViewState] = useState<'select-token' | 'confirm' | 'success' | 'connect-wallet'>('select-token')
  const { lastUsedWallet } = useCodattaConnectContext()
  const [selectedAsset, setSelectedAsset] = useState<ClaimableReward>()

  // State Synchronization
  useEffect(() => {
    if (!props.open) {
      // Reset internal state when modal closes
      setTimeout(() => {
        setViewState('select-token')
        setSelectedAsset(undefined)
      }, 300)
      return
    }

    if (!lastUsedWallet || !lastUsedWallet.connected) {
      setViewState('connect-wallet')
    } else if (viewState === 'connect-wallet') {
      setViewState('select-token')
    }
  }, [props.open, lastUsedWallet, viewState])

  // Handlers
  function handleTokenSelect(asset: ClaimableReward) {
    console.log('handleTokenSelect', asset)
    if (asset.amount <= 0) {
      message.error('Amount must be greater than 0')
      return
    }
    setSelectedAsset(asset)
    setViewState('confirm')
  }

  const handleClose = useCallback(() => {
    props.onClose()
  }, [props])

  useEffect(() => {
    if (props.assets.length === 0) {
      message.error('No lockable assets found')
      handleClose()
    }
  }, [props.assets, handleClose])

  return (
    <Modal
      open={props.open}
      onCancel={handleClose}
      width={480}
      footer={null}
      styles={{ content: { padding: 0, backgroundColor: '#252532', color: 'white' } }}
      centered
      destroyOnHidden
      maskClosable={false}
      closable={viewState !== 'confirm' && viewState !== 'success'} // Prevent close during heavy actions if needed, though LockConfirm handles its own 'isWriting' disabled state
      closeIcon={<span className="text-white/60 hover:text-white">✕</span>}
    >
      {viewState === 'connect-wallet' && (
        <div className="p-6">
          <div className="mb-6 text-lg font-bold text-white">Connect Wallet</div>
          <CodattaConnect
            config={{ showTonConnect: false, showFeaturedWallets: true }}
            onEvmWalletConnect={async (w: EmvWalletConnectInfo) => console.log('Connected', w)}
          />
        </div>
      )}

      {viewState === 'select-token' && <SelectToken onSelect={handleTokenSelect} assets={props.assets} />}

      {viewState === 'confirm' && selectedAsset && (
        <LockConfirm asset={selectedAsset} onClose={handleClose} onSuccess={() => setViewState('success')} />
      )}

      {viewState === 'success' && <LockSuccess onClose={handleClose} />}
    </Modal>
  )
}
