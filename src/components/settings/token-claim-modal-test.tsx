import { userStoreActions, useUserStore } from '@/stores/user.store'
import { Button, message, Modal, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext } from 'codatta-connect'
import ClaimRewardContract from '@/contracts/claim-reward.abi'
import { createPublicClient, formatEther, http, encodeFunctionData, Abi, Chain, parseEther } from 'viem'
import { bsc, base } from 'viem/chains'
import userApi, { RewardClaimSignResponse } from '@/apis/user.api'
import { shortenAddress } from '@/utils/wallet-address'
import { Loader2 } from 'lucide-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { keccak256, stringToHex } from 'viem'
import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import { getAddress } from 'viem'

interface Asset {
  type: string
  amount: string
  currency: string
  Icon?: React.ReactNode
}

interface TokenConfig {
  tokenContractAddress: string
}

const TokenConfigMap = new Map<string, TokenConfig>()
TokenConfigMap.set('USDT', {
  tokenContractAddress:
    import.meta.env.VITE_MODE === 'production'
      ? '0x55d398326f99059fF775485246999027B3197955'
      : '0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63'
})
TokenConfigMap.set('XnYCoin', {
  tokenContractAddress:
    import.meta.env.VITE_MODE === 'production'
      ? '0xE3225e11Cab122F1a126A28997788E5230838ab9'
      : '0x0000000000000000000000000000000000000000'
})

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
  const { info } = useUserStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    userStoreActions.getUserInfo().finally(() => {
      setLoading(false)
    })
  }, [])

  const assets = useMemo(() => {
    const xny = info?.user_assets?.find((asset) => asset.asset_type === 'XnYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance

    return [
      {
        type: 'XnYCoin',
        amount: xny?.amount ?? '0.0',
        currency: 'XNY',
        Icon: <XnyIcon />
      },
      {
        type: 'USDT',
        amount: usdt?.amount ?? '0.0',
        currency: usdt?.currency ?? 'USDT',
        Icon: <USDTIcon />
      }
    ]
  }, [info])

  function handleSelectToken(asset: Asset) {
    props.onSelect(asset)
  }

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <div className="mb-6">Select Token</div>
        <div className="grid grid-cols-1 gap-2">
          {assets.map((asset) => (
            <li
              key={asset.currency}
              className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#FFFFFF1F] p-6 hover:border-primary"
              onClick={() => handleSelectToken(asset)}
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
    return getAddress(lastUsedWallet.address!)
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
    const tokenConfig = TokenConfigMap.get(asset.type)
    if (!tokenConfig) return
    if (!address) return

    const estimateGas = await rpcClient.estimateGas({
      account: address as `0x${string}`,
      to: contract.address as `0x${string}`,
      data: encodeFunctionData({
        abi: contract.abi,
        functionName: 'claim',
        args: getContractCallParams(signResponse)
      })
    })
    setEstimateGas(formatEther(estimateGas))
  }

  async function handleOnClaim() {
    const tokenConfig = TokenConfigMap.get(asset.type)
    if (!tokenConfig) return
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
      // await userApi.createRewardRecord(claimSignature.uid, estimateGas!)

      let tx = null
      try {
        setClaimTip('Please check and approve the claim request in your wallet.')
        tx = await lastUsedWallet?.client?.writeContract(request)
      } catch (err) {
        // await userApi.finishRewardRecord(claimSignature.uid, 4)
        onClose()
        throw err
      }

      setClaimTip('Waiting for transaction to be confirmed...')
      if (!tx) throw new Error('Transaction failed')
      // update tx_hash to backend
      // await userApi.updateRewardRecord(claimSignature.uid, tx)
      const receipt = await rpcClient.waitForTransactionReceipt({ hash: tx })

      // sync onchain status to backend
      const status = receipt.status === 'success' ? 2 : 3
      // userApi.finishRewardRecord(claimSignature.uid, status)
      if (status === 2) onSuccess()
    } catch (err) {
      message.error(err.details || err.message)
    }
    setClaimLoading(false)
    onLoading(false)
  }

  async function getClaimSignature() {
    const tokenConfig = TokenConfigMap.get(asset.type)
    if (!tokenConfig) return
    if (!contract) return
    if (!address) return

    try {
      const signResponse = await userApi.getRewardClaimSign({
        address: address! as string,
        // test env only supoort 0.01
        amount: import.meta.env.VITE_MODE === 'production' ? asset.amount : '0.02',
        // amount: asset.amount,
        chain_id: contract?.chain.id.toString(),
        token: tokenConfig.tokenContractAddress,
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
    console.log(wallet)
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
