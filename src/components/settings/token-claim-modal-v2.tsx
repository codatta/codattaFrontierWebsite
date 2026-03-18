import { Button, message, Modal, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import { parseEther, checksumAddress } from 'viem'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Loader2 } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import ClaimRewardContract from '@/contracts/claim-reward.abi'
import userApi, { RewardClaimSignResponse } from '@/apis/user.api'
import { shortenAddress } from '@/utils/format'
import { userStoreActions } from '@/stores/user.store'
import { TOKEN_CONTRACT_ADDRESS } from './config'

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

// Fee fixed at 0.01 for testing
const FIXED_FEE = '0.01'

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
  onSuccess: () => void
}) {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [loading, setLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimSignature, setClaimSignature] = useState<RewardClaimSignResponse>()
  const [claimTip, setClaimTip] = useState<string>()

  // Check if reward can cover fee
  const canCoverFee = useMemo(() => {
    if (!claimSignature?.amount) return false
    const reward = parseFloat(String(claimSignature.amount))
    const fee = parseFloat(FIXED_FEE)
    return reward >= fee
  }, [claimSignature])

  // Calculate user will receive amount
  const userWillReceive = useMemo(() => {
    if (!claimSignature?.amount) return '0'
    const reward = parseFloat(String(claimSignature.amount))
    const fee = parseFloat(FIXED_FEE)
    if (reward < fee) return '0'
    return (reward - fee).toFixed(2)
  }, [claimSignature])

  const contract = useMemo(() => {
    if (['XnYCoin', 'USDT'].includes(asset.type)) {
      return ClaimRewardContract
    }
    return null
  }, [asset.type])

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
      const uid = BigInt(claimSignature.uid)
      const domain = {
        name: 'CodattaAsset',
        version: '1',
        chainId: contract.chain.id,
        verifyingContract: contract.address as `0x${string}`
      }
      const types = {
        RecipientRelayedClaim: [
          { name: 'token', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'grossAmount', type: 'uint256' },
          { name: 'uid', type: 'uint256' },
          { name: 'expiredAt', type: 'uint256' }
        ]
      }
      const eipMessage = {
        token: claimSignature.token as `0x${string}`,
        recipient: address,
        grossAmount: parseEther(claimSignature.amount.toString()),
        uid,
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

      if (result.flag === 1) {
        onSuccess()
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
        amount: import.meta.env.VITE_MODE === 'production' ? asset.amount : '0.05',
        chain_id: contract.chain.id.toString(),
        token: tokenContractAddress,
        reward_type: asset.type as 'USDT' | 'XnYCoin'
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
      <div className="p-6 text-base">
        <div className="mb-6 text-lg font-bold text-white">Claim Rewards</div>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center">
            <span className="text-white/50">Receiving Wallet Address</span>
            <span className="ml-auto text-white">{shortenAddress(address!, 12)}</span>
          </div>

          <div className="flex items-center">
            <span className="text-white/50">Reward</span>
            <span className="ml-auto text-white">
              <InfoItemLoading loading={loading}>
                {claimSignature?.amount} {asset.currency}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-white/50">Fee</span>
            <span className="ml-auto text-white">
              <InfoItemLoading loading={loading}>
                {FIXED_FEE} {asset.currency}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex items-center">
            <span className="font-medium text-[#00D68F]">You Receive</span>
            <span className="ml-auto font-bold text-[#00D68F]">
              <InfoItemLoading loading={loading}>
                {canCoverFee ? `${userWillReceive} ${asset.currency}` : '--'}
              </InfoItemLoading>
            </span>
          </div>
        </div>

        {/* Fee deduction info or insufficient reward warning */}
        {canCoverFee ? (
          <div className="mb-4 text-sm text-[#00D68F]">Fee will be deducted before payout.</div>
        ) : (
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex gap-3 rounded-2xl bg-[#D92B2B14] p-3 text-sm text-[#D92B2B]">
              <div>
                <InfoCircleOutlined className="text-lg"></InfoCircleOutlined>
              </div>
              <p>The current reward is not enough to cover the fee.</p>
            </div>
            <p className="text-sm text-[#8D8D93]">
              Claim will be available once your pending reward is enough to cover the fee.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button type="link" onClick={() => onClose()} disabled={claimLoading}>
            Cancel
          </Button>
          <Button
            disabled={claimLoading || !canCoverFee}
            type="primary"
            shape="round"
            size="large"
            className="min-w-32"
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
        Got
      </Button>
    </div>
  )
}

export default function TokenClaimModalV2(props: TokenClaimModalV2Props) {
  const [step, setStep] = useState<'select-token' | 'claim-confirm' | 'claim-success' | 'connect-wallet'>()
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
            onSuccess={() => setStep('claim-success')}
          />
        )}
        {step === 'claim-success' && <ClaimSuccess onClose={handleOnCancel} />}
      </Modal>
    </>
  )
}
