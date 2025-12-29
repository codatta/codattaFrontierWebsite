import { Button, message, Modal, Spin } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import {
  createPublicClient,
  formatEther,
  http,
  encodeFunctionData,
  Abi,
  Chain,
  parseEther,
  keccak256,
  stringToHex,
  checksumAddress
} from 'viem'
import { bsc } from 'viem/chains'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Loader2 } from 'lucide-react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import ClaimRewardContract from '@/contracts/claim-reward.abi'
import userApi, { RewardClaimSignResponse } from '@/apis/user.api'
import { shortenAddress } from '@/utils/wallet-address'
import { calculateGasEstimation } from '@/hooks/use-gas-estimation'
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

interface TokenClaimModalProps {
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
  onSuccess: () => void
}) {
  const [balance, setBalance] = useState<string>()
  const [estimateGas, setEstimateGas] = useState<string>()
  const { lastUsedWallet } = useCodattaConnectContext()
  const [loading, setLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimSignature, setClaimSignature] = useState<RewardClaimSignResponse>()
  const [claimTip, setClaimTip] = useState<string>()

  const showGasWarning = useMemo(() => {
    if (!estimateGas || !balance) return false

    return Number(estimateGas) > Number(balance)
  }, [estimateGas, balance])

  const contract = useMemo(() => {
    if (['XnYCoin', 'USDT'].includes(asset.type)) {
      return ClaimRewardContract
    }
    return null
  }, [asset])

  const rpcClient = useMemo(() => {
    const rpcUrl = contract?.chain.rpcUrls.default.http[0]

    return createPublicClient({
      chain: bsc,
      transport: http(rpcUrl)
    })
  }, [contract])

  const address = useMemo(() => {
    if (!lastUsedWallet) return null
    return checksumAddress(lastUsedWallet.address as `0x${string}`)
  }, [lastUsedWallet])

  async function getBalance(address: `0x${string}`) {
    if (!address) return
    const balance = await rpcClient.getBalance({
      address
    })
    setBalance(formatEther(balance))
  }

  function getContractCallParams(signResponse: RewardClaimSignResponse) {
    const uid = keccak256(stringToHex(signResponse.uid))
    const amount = parseEther(signResponse.amount.toString())
    return [uid, signResponse.token, amount, signResponse.expired_at, `0x${signResponse.signature}`]
  }

  useEffect(() => {
    if (!claimSignature) return
    if (!address) return
    if (!contract) return
    getEstimateGas(contract, claimSignature)
  }, [claimSignature, contract, address])

  async function getEstimateGas(
    contract: { abi: Abi; chain: Chain; address: string },
    signResponse: RewardClaimSignResponse
  ) {
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS[asset.type]
    if (!tokenContractAddress) return
    if (!address) return

    try {
      const data = encodeFunctionData({
        abi: contract.abi,
        functionName: 'claim',
        args: getContractCallParams(signResponse)
      })

      const result = await calculateGasEstimation({
        rpcClient,
        account: address as `0x${string}`,
        to: contract.address as `0x${string}`,
        data
      })

      setEstimateGas(result.totalCostFormatted)
      console.log('Gas estimation for claim:', {
        gasLimit: result.gasLimit.toString(),
        totalCost: result.totalCostFormatted
      })
    } catch (error) {
      console.error('Gas estimation failed:', error)
      setEstimateGas('0')
    }
  }

  async function handleOnClaim() {
    const tokenContractAddress = TOKEN_CONTRACT_ADDRESS[asset.type]
    if (!tokenContractAddress) return
    if (!contract) return
    if (!claimSignature) return

    setClaimLoading(true)
    onLoading(true)
    try {
      const chain_id = await lastUsedWallet?.getChain()
      if (!chain_id) throw new Error('Chain not found')
      setClaimTip('Create claim transaction...')
      if (chain_id !== contract.chain.id) {
        await lastUsedWallet?.switchChain(contract.chain)
      }

      // simulate tx
      const { request } = await rpcClient.simulateContract({
        account: address as `0x${string}`,
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: 'claim',
        args: getContractCallParams(claimSignature),
        chain: contract.chain
      })
      // create record to backend
      await userApi.createRewardRecord(claimSignature.uid, estimateGas!)

      let tx = null
      try {
        setClaimTip('Please check and approve the claim request in your wallet.')
        tx = await lastUsedWallet?.client?.writeContract(request)
      } catch (err) {
        await userApi.finishRewardRecord(claimSignature.uid, 4)
        onClose()
        throw err
      }

      setClaimTip('Waiting for transaction to be confirmed...')
      if (!tx) throw new Error('Transaction failed')
      // update tx_hash to backend
      await userApi.updateRewardRecord(claimSignature.uid, tx)
      const receipt = await rpcClient.waitForTransactionReceipt({ hash: tx })

      // sync onchain status to backend
      const status = receipt.status === 'success' ? 2 : 3
      userApi.finishRewardRecord(claimSignature.uid, status)
      if (status === 2) onSuccess()
    } catch (err) {
      message.error(err.details || err.message)
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
        address: address! as string,
        // test env only supoort 0.01
        amount: import.meta.env.VITE_MODE === 'production' ? asset.amount : '0.02',
        // amount: asset.amount,
        chain_id: contract?.chain.id.toString(),
        token: tokenContractAddress,
        reward_type: asset.type as 'USDT' | 'XnYCoin'
      })

      // convert amount to number
      setClaimSignature({
        ...signResponse,
        amount: signResponse.amount.toString()
      })
    } catch (err) {
      message.error(err.details || err.message)
      onClose()
    }
  }

  useEffect(() => {
    if (!address) return
    setLoading(true)
    onLoading(true)
    Promise.all([getBalance(address), getClaimSignature()])
      .then(() => setLoading(false))
      .finally(() => {
        onLoading(false)
        setLoading(false)
      })
  }, [address, asset])

  return (
    <Spin spinning={claimLoading || loading} tip={claimTip} wrapperClassName=" text-white">
      <div className="p-6 text-base">
        <div className="mb-6 text-lg font-bold text-white">Claim Rewards</div>

        <div className="mb-12 flex flex-col gap-4">
          <div className="flex items-center">
            <span className="text-white/50">Network</span>
            <span className="ml-auto text-white">{contract?.chain.name}</span>
          </div>

          <div className="flex items-center">
            <span className="text-white/50">Receiving Wallet Address</span>
            <span className="ml-auto text-white">{shortenAddress(address!, 12)}</span>
          </div>

          <div className="flex items-center">
            <span className="text-white/50">Balance</span>
            <span className="ml-auto text-white">
              <InfoItemLoading loading={loading}>
                {balance} {contract?.chain.nativeCurrency.symbol}
              </InfoItemLoading>
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-white/50">Gas Fee</span>
            <span className="ml-auto text-white">
              <InfoItemLoading loading={loading}>
                {estimateGas} {contract?.chain.nativeCurrency.symbol}
              </InfoItemLoading>
            </span>
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
            <span className="text-white/50">Time</span>
            <span className="ml-auto text-white">{new Date().toLocaleString()}</span>
          </div>
        </div>

        {showGasWarning && (
          <div className="flex gap-3 rounded-2xl bg-[#D92B2B14] p-3 text-sm text-[#D92B2B]">
            <div>
              <InfoCircleOutlined className="text-lg"></InfoCircleOutlined>
            </div>
            <p>BNB balance insufficient to cover gas. Please top up and try again.</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-4">
          <Button type="link" onClick={() => onClose()} disabled={claimLoading}>
            Cancel
          </Button>
          <Button
            disabled={claimLoading}
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

export default function TokenClaimModal(props: TokenClaimModalProps) {
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

  function handleOnCancel() {
    props.onClose()
  }

  async function handleOnEvmWalletConnect(wallet: EmvWalletConnectInfo) {
    setStep('select-token')
  }

  function handleLoading(loading: boolean) {
    setLoading(loading)
  }

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
