import { useUserStore } from '@/stores/user.store'
import { formatNumber } from '@/utils/str'
import { Modal } from 'antd'
import { Children, useEffect, useMemo, useState } from 'react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import { CodattaConnect, useCodattaConnectContext } from 'codatta-connect'
import RewardClaimContract from '@/contracts/reward-withdraw.abi'
import { createPublicClient, formatEther, http, encodeFunctionData } from 'viem'
import { bsc } from 'viem/chains'
import userApi from '@/apis/user.api'
import { shortenAddress } from '@/utils/wallet-address'
import { Loader2 } from 'lucide-react'

interface Asset {
  type: string
  amount: number
  currency: string
  Icon?: React.ReactNode
}

function InfoItemLoading(props: { loading: boolean; children: React.ReactNode }) {
  if (props.loading) {
    return (
      <div className="h-4 w-24 animate-pulse rounded-md bg-white/10">
        <Loader2 />
      </div>
    )
  }
  return props.children
}

interface TokenClaimModalProps {
  open: boolean
  onClose: () => void
}

function SelectToken(props: { onSelect: (asset: Asset) => void }) {
  const { info } = useUserStore()

  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XNYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const xynAmount = formatNumber(Number(xyn?.amount ?? 0.0))
    const usdtAmount = formatNumber(Number(usdt?.amount ?? 0.0))

    return [
      {
        type: 'XNYCoin',
        amount: xynAmount === '0' ? '0.00' : xynAmount,
        currency: xyn?.currency ?? 'XNY Token',
        Icon: <XnyIcon />
      },
      {
        type: 'USDT',
        amount: usdtAmount === '0' ? '0.00' : usdtAmount,
        currency: usdt?.currency ?? 'USDT',
        Icon: <USDTIcon />
      }
    ]
  }, [info])

  function handleSelectToken(asset: Asset) {
    props.onSelect(asset)
  }

  return (
    <div className="p-6">
      <div className="mb-6">Select Token</div>
      <div className="grid grid-cols-1 gap-2">
        {assets.map((asset) => (
          <li
            key={asset.currency}
            className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6 hover:border-primary"
            onClick={() => props.onSelect(asset)}
          >
            {asset.Icon}
            <div className="text-right">
              <div className="mb-1 text-[28px] font-bold">{asset.amount}</div>
              <div className="text-base text-[#BBBBBE]">{asset.currency}</div>
            </div>
          </li>
        ))}
      </div>
    </div>
  )
}

function ClaimConfirm({ asset }: { asset: Asset }) {
  const [balance, setBalance] = useState<string>()
  const [estimateGas, setEstimateGas] = useState<string>()
  const { lastUsedWallet } = useCodattaConnectContext()
  const [loading, setLoading] = useState(false)

  const showGasWarning = useMemo(() => {
    if (!estimateGas || !balance) return false
    return Number(estimateGas) > Number(balance)
  }, [estimateGas, balance])

  const bscClient = createPublicClient({
    chain: bsc,
    transport: http('https://bsc-dataseed1.bnbchain.org')
  })

  const contract = useMemo(() => {
    if (asset.type === 'XNYCoin') {
      return RewardClaimContract
    } else if (asset.type === 'USDT') {
      return RewardClaimContract
    } else {
      return null
    }
  }, [asset])

  const address = useMemo(() => {
    if (!lastUsedWallet) return null
    return lastUsedWallet.address
  }, [lastUsedWallet])

  async function getBalance() {
    if (!address) return
    const balance = await bscClient.getBalance({
      address
    })
    setBalance(formatEther(balance))
  }

  async function getEstimateGas() {
    if (!contract?.address || !address) return

    const estimateGas = await bscClient.estimateGas({
      to: contract.address as `0x${string}`,
      data: encodeFunctionData({
        abi: contract.abi,
        functionName: 'claimReward',

        // TODO
        args: [asset.amount]
      }),
      account: address as `0x${string}`
    })
    setEstimateGas(formatEther(estimateGas))
  }

  async function getClaimSign() {
    if (!address) return
    // TODO
    const sign = await userApi.getClaimSign(address, asset.amount)
    return sign
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([getBalance(), getEstimateGas()])
      .then(() => setLoading(false))
      .finally(() => setLoading(false))
  }, [address])

  return (
    <div className="p-6">
      <div className="mb-6">Claim Rewards</div>

      <div className="mb-6">
        <div className="flex items-center">
          <span className="text-white/50">Network</span>
          <span className="ml-auto text-white">{contract?.chain.name}</span>
        </div>

        <div className="flex items-center">
          <span className="text-white/50">Receiving Wallet Address</span>
          <span className="ml-auto text-white">{shortenAddress(address!, 4)}</span>
        </div>

        <div className="flex items-center">
          <span className="text-white/50">Balance</span>
          <span className="ml-auto text-white">
            <InfoItemLoading loading={loading}>{balance}</InfoItemLoading>
          </span>
        </div>
      </div>

      {showGasWarning && (
        <div className="text-red-500">BNB balance insufficient to cover gas. Please top up and try again.</div>
      )}
    </div>
  )
}

export default function TokenClaimModal(props: TokenClaimModalProps) {
  const [step, setStep] = useState<'select-token' | 'claim-confirm' | 'claim-success' | 'connect-wallet'>()
  const { lastUsedWallet } = useCodattaConnectContext()
  const [selectedAsset, setSelectedAsset] = useState<Asset>()

  useEffect(() => {
    if (!lastUsedWallet) {
      setStep('select-token')
    }
  }, [lastUsedWallet])

  function onTokenSelect(token: string) {
    setSelectedAsset({
      type: token,
      amount: 0,
      currency: token
    })
    setStep('claim-confirm')
  }

  return (
    <>
      <Modal
        open={props.open}
        onCancel={props.onClose}
        width={468}
        footer={null}
        styles={{ content: { padding: 0 } }}
        destroyOnHidden
      >
        {step === 'select-token' && <SelectToken onSelect={onTokenSelect} />}
        {step === 'connect-wallet' && (
          <CodattaConnect config={{ showTonConnect: false, showFeaturedWallets: true }}></CodattaConnect>
        )}
        {step === 'claim-confirm' && <ClaimConfirm asset={selectedAsset} />}
      </Modal>
    </>
  )
}
