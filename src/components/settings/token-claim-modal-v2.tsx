import { Button, message, Modal, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { parseEther, parseUnits, checksumAddress, keccak256, stringToHex } from 'viem'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import PendingIcon from '@/assets/frontier/crypto/pending-icon.svg'

import ClaimRewardContract from '@/contracts/claim-reward-v2.abi'
import userApi, { RewardClaimSignResponse } from '@/apis/user.api'
import { shortenAddress } from '@/utils/format'
import { userStoreActions } from '@/stores/user.store'
import { useGasFee } from '@/hooks/use-gas-fee'

const isProduction = import.meta.env.VITE_MODE === 'production'

const TOKEN_CONTRACT_ADDRESS: Record<string, string> = {
  USDT: isProduction ? '' : '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  XnYCoin: isProduction ? '' : '0xe9fC6F3CcD332e84054D8Afd148ecE66BF18C2bA'
}

const ESTIMATED_GAS_LIMIT = 150000

interface Asset {
  type: string
  amount: string
  currency: string
  Icon?: React.ReactNode
}

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

interface TokenClaimModalV2Props {
  open: boolean
  onClose: () => void
}

function SelectToken(props: { onSelect: (asset: Asset) => void }) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)
  const getClaimableRewards = useCallback(async () => {
    try {
      setLoading(true)
      const assets = await userApi.getClaimableRewards('normal')
      const assetsList: Asset[] = assets
        .filter((asset) => asset.asset_type === 'USDT' || asset.asset_type === 'XnYCoin')
        .map((asset) => ({
          type: asset.asset_type,
          amount: asset.amount?.toString() ?? '0.0',
          currency: asset.name ?? 'USDT',
          Icon: getAssetIcon(asset.asset_type)
        }))
      console.log('rewards:', assets)
      setAssets(assetsList)
    } catch (error) {
      console.error('Failed to fetch rewards:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getClaimableRewards()
  }, [getClaimableRewards])

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <div className="mb-6 text-lg font-bold text-white">Select Token</div>
        <div className="grid grid-cols-1 gap-2">
          {assets?.length === 0 && <div className="py-8 text-center text-[#8D8D93]">No assets found.</div>}
          {assets?.map((asset) => (
            <div
              key={asset.type}
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6 hover:border-primary"
              onClick={() => props.onSelect(asset)}
            >
              <div className="flex items-center gap-3">{asset.Icon}</div>
              <div className="text-right">
                <div className="mb-1 text-[28px] font-bold">{asset.amount}</div>
                <div className="text-base text-[#BBBBBE]">{asset.currency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Spin>
  )
}

function ClaimConfirm({
  asset,
  onClose,
  onLoading,
  onSuccess
}: {
  asset: Asset
  onClose: () => void
  onLoading: (loading: boolean) => void
  onSuccess: (flag: 1 | 2) => void
}) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [loading, setLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimSignature, setClaimSignature] = useState<RewardClaimSignResponse>()
  const [claimTip, setClaimTip] = useState<string>()

  const contract = useMemo(() => {
    if (['XnYCoin', 'USDT'].includes(asset.type)) {
      return ClaimRewardContract
    }
    return null
  }, [asset.type])

  const tokenAddress = TOKEN_CONTRACT_ADDRESS[asset.type] || ''

  const { gasFee, isLoading: gasFeeLoading } = useGasFee({
    gasLimit: ESTIMATED_GAS_LIMIT,
    chainId: contract?.chain.id,
    enabled: !!contract && !!tokenAddress,
    tokenAddress
  })

  // Check if reward can cover fee (gas fee is calculated in the same token)
  const canCoverFee = useMemo(() => {
    if (!claimSignature?.amount || !gasFee) return false
    const reward = parseFloat(String(claimSignature.amount))
    const fee = parseFloat(gasFee)
    return reward >= fee
  }, [claimSignature, gasFee])

  // Calculate user will receive amount (reward - gas fee)
  const userWillReceive = useMemo(() => {
    if (!claimSignature?.amount || !gasFee) return '0'
    const reward = parseFloat(String(claimSignature.amount))
    const fee = parseFloat(gasFee)

    if (reward < fee) return '0'
    return (reward - fee).toFixed(4)
  }, [claimSignature, gasFee])

  const address = useMemo(() => {
    if (!lastUsedWallet) return null
    return checksumAddress(lastUsedWallet.address as `0x${string}`)
  }, [lastUsedWallet])

  async function handleOnClaim() {
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS[asset.type]
    if (!tokenContractAddress || !contract || !claimSignature || !lastUsedWallet?.client) return
    if (!address) return
    // Prevent claim if reward cannot cover fee
    if (!canCoverFee) {
      message.error('Current reward is not enough to cover the fee.')
      return
    }

    setClaimLoading(true)
    onLoading(true)
    try {
      // Switch chain if needed
      const chainId = await lastUsedWallet.getChain()
      if (chainId !== contract.chain.id) {
        await lastUsedWallet.switchChain(contract.chain)
      }

      // Build EIP-712 typed data
      // const uid = BigInt(claimSignature.uid)
      // const uidBytes32 = pad(toHex(uid), { size: 32 })

      const uid =
        claimSignature.uid.startsWith('0x') && claimSignature.uid.length === 66
          ? (claimSignature.uid as `0x${string}`)
          : keccak256(stringToHex(claimSignature.uid))
      const domain = {
        name: 'CodattaAsset',
        version: '1',
        chainId: contract.chain.id,
        verifyingContract: contract.address as `0x${string}`
      }
      const types = {
        RecipientRelayedClaim: [
          { name: 'uid', type: 'bytes32' },
          { name: 'token', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'grossAmount', type: 'uint256' },
          { name: 'expiredAt', type: 'uint256' }
        ]
      }
      // Calculate grossAmount based on token type
      // XNY: 18 decimals, USDT: 6 decimals
      const grossAmount =
        asset.type === 'USDT'
          ? parseUnits(claimSignature.amount.toString(), 6)
          : parseEther(claimSignature.amount.toString())

      console.log('grossAmount', asset.type, grossAmount)

      const eipMessage = {
        uid: uid as `0x${string}`,
        token: claimSignature.token as `0x${string}`,
        recipient: address,
        grossAmount,
        expiredAt: BigInt(claimSignature.expired_at)
      }

      // Request wallet signature
      setClaimTip('Please sign the claim request in your wallet...')
      const recipientSignature = await lastUsedWallet.client.signTypedData({
        account: address,
        domain,
        types,
        primaryType: 'RecipientRelayedClaim',
        message: eipMessage
      })

      // Submit claim to backend
      setClaimTip('Submitting claim request...')
      const result = await userApi.claimReward({
        uid: claimSignature.uid,
        recipient_signature: recipientSignature
      })

      if (result.flag === 1 || result.flag === 2) {
        onSuccess(result.flag as 1 | 2)
      } else {
        message.error(result.message || 'Claim failed')
      }
    } catch (err) {
      const error = err as { details?: string; message?: string }
      message.error(error.details || error.message || 'Claim failed')
    }
    setClaimLoading(false)
    onLoading(false)
  }

  async function getClaimSignature() {
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS[asset.type]
    if (!tokenContractAddress) return
    if (!contract) return
    if (!address) return

    try {
      const signResponse = await userApi.getRewardClaimSign({
        address: address as string,
        amount: import.meta.env.VITE_MODE === 'production' ? asset.amount : '5',
        chain_id: contract.chain.id.toString(),
        token: tokenContractAddress,
        reward_type: asset.type as 'USDT' | 'XnYCoin',
        claim_type: 'no_gas'
      })

      setClaimSignature({
        ...signResponse,
        amount: signResponse.amount.toString()
      })
    } catch (err) {
      const error = err as { details?: string; message?: string }
      message.error(error.details || error.message || 'Failed to get claim signature')
      onClose()
    }
  }

  useEffect(() => {
    if (!address) return
    setLoading(true)
    onLoading(true)
    getClaimSignature()
      .then(() => setLoading(false))
      .finally(() => {
        onLoading(false)
        setLoading(false)
      })
  }, [address, asset])

  return (
    <Spin spinning={claimLoading || loading} tip={claimTip} wrapperClassName="text-white">
      <div className="flex flex-col gap-6 rounded-3xl bg-[#252532] p-6">
        <div className="text-lg font-bold leading-7 text-white">Claim Rewards</div>

        <div className="flex flex-col gap-6 pb-6">
          <div className="flex items-center justify-between text-base leading-6">
            <span className="text-[#8d8d93]">Network</span>
            <span className="text-white">{contract?.chain.name || 'Unknown'}</span>
          </div>

          <div className="flex items-center justify-between text-base leading-6">
            <span className="text-[#8d8d93]">Receiving Wallet Address</span>
            <span className="text-white">{shortenAddress(address!, 12)}</span>
          </div>

          <div className="flex items-center justify-between text-base leading-6">
            <span className="text-[#8d8d93]">Reward</span>
            <span className="text-white">
              <InfoItemLoading loading={loading}>
                {claimSignature?.amount} {asset.currency}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex items-center justify-between text-base leading-6">
            <span className="text-[#8d8d93]">Gas Fee</span>
            <span className="text-white">
              <InfoItemLoading loading={loading || gasFeeLoading}>
                {gasFee ? `${gasFee} ${asset.currency}` : '--'}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-[#1c1c26] p-4">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.12)] pb-2 text-lg font-bold leading-7">
              <span className="text-white">You Receive</span>
              <span className="text-[#ffa800]">
                <InfoItemLoading loading={loading}>
                  {canCoverFee ? (
                    <>
                      {userWillReceive} <span className="font-normal">{asset.currency}</span>
                    </>
                  ) : (
                    '--'
                  )}
                </InfoItemLoading>
              </span>
            </div>
            <p className="text-sm leading-[22px] text-[#77777d]">
              {canCoverFee
                ? `Gas fee (in ${asset.currency}) will be deducted before payout.`
                : 'The current reward is not enough to cover the fee. Claim will be available once your pending reward is enough to cover the fee.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="text"
            onClick={() => onClose()}
            disabled={claimLoading}
            className="min-w-[120px] rounded-full text-white"
          >
            Cancel
          </Button>
          <Button
            disabled={claimLoading || !canCoverFee}
            type="primary"
            className={`min-w-[120px] rounded-full bg-[#875dff] px-6 py-2.5 ${!canCoverFee ? 'opacity-25' : ''}`}
            onClick={handleOnClaim}
          >
            {claimLoading ? <Loader2 className="animate-spin" /> : 'Claim'}
          </Button>
        </div>
      </div>
    </Spin>
  )
}

function ClaimSuccess({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])
  return (
    <div className="flex flex-col items-center p-6 text-base">
      <img src={SuccessIcon} alt="" className="mb-4 size-[80px]" />
      <div className="mb-6 text-center text-lg font-bold text-white">Claim Success</div>
      <Button shape="round" size="large" type="primary" className="w-[120px]" onClick={onClose}>
        Got it
      </Button>
    </div>
  )
}

function ClaimPending({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()

  const handleViewHistory = () => {
    onClose()
    navigate(`/app/settings/data-assets?tab=claim-history-tab&t=${Date.now()}`)
  }

  return (
    <div className="flex flex-col items-center p-6 text-base">
      <img src={PendingIcon} alt="Pending" className="mb-4 size-[80px]" />
      <div className="mb-6 text-center text-lg font-bold text-white">Claim Submitted</div>
      <div className="mb-8 w-full px-2 text-sm text-[#8d8d93]">
        <div className="mb-6 flex items-start text-center">
          Your claim has been submitted and is being processed on-chain. This may take a few minutes.You can view the
          progress in Claim History.
        </div>
      </div>
      <Button shape="round" size="large" type="primary" className="min-w-[240px]" onClick={handleViewHistory}>
        View Claim History →
      </Button>
    </div>
  )
}

export default function TokenClaimModalV2(props: TokenClaimModalV2Props) {
  const [step, setStep] = useState<
    'select-token' | 'claim-confirm' | 'claim-success' | 'claim-pending' | 'connect-wallet'
  >()
  const { lastUsedWallet } = useCodattaConnectContext()
  const [selectedAsset, setSelectedAsset] = useState<Asset>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!lastUsedWallet || !lastUsedWallet.connected) {
      setStep('connect-wallet')
    } else {
      setStep('select-token')
    }
  }, [props.open, lastUsedWallet])

  function onTokenSelect(token: Asset) {
    if (Number(token.amount) === 0) {
      message.error('No claimable balance for this asset.')
      return
    }
    setSelectedAsset({
      type: token.type,
      amount: token.amount,
      currency: token.currency
    })
    setStep('claim-confirm')
  }

  const handleOnCancel = useCallback(() => {
    props.onClose()
  }, [props.onClose])

  async function handleOnEvmWalletConnect(_wallet: EmvWalletConnectInfo) {
    setStep('select-token')
  }

  const handleLoading = useCallback((loading: boolean) => {
    setLoading(loading)
  }, [])

  return (
    <>
      <Modal
        open={props.open}
        onCancel={handleOnCancel}
        width={468}
        footer={null}
        styles={{ content: { padding: 0 } }}
        destroyOnHidden
        centered
        maskClosable={false}
        closable={!loading}
      >
        {step === 'select-token' && <SelectToken onSelect={onTokenSelect} />}
        {step === 'connect-wallet' && (
          <CodattaConnect
            config={{ showTonConnect: false, showFeaturedWallets: true }}
            onEvmWalletConnect={handleOnEvmWalletConnect}
          ></CodattaConnect>
        )}
        {step === 'claim-confirm' && (
          <ClaimConfirm
            asset={selectedAsset!}
            onClose={handleOnCancel}
            onLoading={handleLoading}
            onSuccess={(flag) => setStep(flag === 1 ? 'claim-success' : 'claim-pending')}
          />
        )}
        {step === 'claim-success' && <ClaimSuccess onClose={handleOnCancel} />}
        {step === 'claim-pending' && <ClaimPending onClose={handleOnCancel} />}
      </Modal>
    </>
  )
}
