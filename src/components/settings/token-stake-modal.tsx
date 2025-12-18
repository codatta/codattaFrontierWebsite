import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal, message, Tooltip } from 'antd'
import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { useCodattaConnectContext } from 'codatta-connect'
import { Loader2 } from 'lucide-react'
import { cn } from '@udecode/cn'

import { TaskStakeInfo } from '@/apis/frontiter.api'
import { formatNumber } from '@/utils/str'
import { shortenAddress } from '@/utils/wallet-address'

interface TokenStakeModalProps {
  open: boolean
  onClose: () => void
  taskStakeInfo?: TaskStakeInfo
  onSuccess?: () => void
}

type ViewState = 'input' | 'success'

const TokenStakeModal: React.FC<TokenStakeModalProps> = ({ open, onClose, taskStakeInfo, onSuccess }) => {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [viewState, setViewState] = useState<ViewState>('input')
  const [amount, setAmount] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState(false)
  const [gasFee] = useState<string>('')

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setViewState('input')
      setAmount('')
    }
  }, [open])

  useEffect(() => {
    if (open && lastUsedWallet?.address && taskStakeInfo?.stake_asset_type) {
      // TODO: Fetch actual token balance using wagmi or viem
      // const tokenAddress = TOKEN_CONTRACT_ADDRESS[taskStakeInfo.stake_asset_type === 'XnYCoin' ? 'XnYCoin' : 'USDT']
      // ... fetch balance
      setBalance('10037')
    }
  }, [open, lastUsedWallet, taskStakeInfo])

  const assetSymbol = taskStakeInfo?.stake_asset_type === 'XnYCoin' ? 'XNY' : taskStakeInfo?.stake_asset_type || 'XNY'
  const minStake = 1000

  const handleMax = () => {
    setAmount(balance)
  }

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString())
  }

  const handleStake = async () => {
    if (!amount || Number(amount) <= 0) return
    if (Number(amount) > Number(balance)) return

    setLoading(true)
    try {
      // TODO: Implement actual staking logic
      // 1. Approve if needed
      // 2. Call stake/lock contract

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setViewState('success')
      onSuccess?.()
    } catch (error) {
      console.error(error)
      message.error('Stake failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToStaking = () => {
    setViewState('input')
    setAmount('')
    onClose()
  }

  const reputationImpact = useMemo(() => {
    if (!taskStakeInfo || !amount) return null
    const { need_reputation, user_reputation, stake_amount } = taskStakeInfo
    // Avoid division by zero
    if (stake_amount <= 0) return 0

    // Calculate ratio: points per token
    // Suggested stake amount covers the gap
    const gap = Math.max(0, need_reputation - user_reputation)
    const ratio = gap / stake_amount

    const addedPoints = Math.floor(Number(amount) * ratio)
    return addedPoints
  }, [taskStakeInfo, amount])

  const currentReputation = taskStakeInfo?.user_reputation || 0
  const afterReputation = currentReputation + (reputationImpact || 0)

  const isInsufficientBalance = Number(amount) > Number(balance)
  const isValidAmount = Number(amount) >= minStake

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      centered
      closable={!loading}
      maskClosable={false}
      styles={{
        content: {
          padding: 0,
          backgroundColor: '#1C1C26',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      {/* Header */}
      <div className="relative border-b border-[#FFFFFF1F] p-4 text-center">
        <div className="text-lg font-bold text-white">Stake {assetSymbol}</div>
      </div>

      <div className="p-6">
        {viewState === 'input' && (
          <>
            <div className="mb-6 text-[#A0A0B0]">Lock {assetSymbol} to boost your reputation across activities.</div>

            <div className="mb-6 rounded-xl bg-[#252532] p-6 text-sm">
              {/* Stake Amount Input */}
              <div className="mb-2 text-base font-bold">Stake amount</div>
              {/* <div
                className={cn(
                  'mb-2 flex items-center justify-between rounded-xl border px-4 py-3',
                  isInsufficientBalance ? 'border-[#D92B2B]' : 'border-[#FFFFFF1F] focus-within:border-primary'
                )}
              > */}
              <Input
                value={amount}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d*\.?\d*$/.test(val)) setAmount(val)
                }}
                className="mb-2 h-[62px] rounded-lg border border-[#FFFFFF1F] bg-transparent p-0 px-4 text-[28px] font-bold text-white placeholder:text-[#FFFFFF4D]"
                placeholder="0.00"
                suffix={
                  <div className="text-sm font-normal">
                    <span className="mr-3 text-base">${assetSymbol}</span>
                    <Button className="h-[38px] rounded-full bg-[#FFFFFF14]">MAX</Button>
                  </div>
                }
              />
              {isInsufficientBalance && <div className="mb-2 text-sm text-[#D92B2B]">Insufficient balance.</div>}

              <div className="mb-3 flex items-center justify-between text-base text-[#77777D]">
                <span>
                  Min stake: {formatNumber(minStake, 2)} {assetSymbol}
                </span>
                <span>
                  Balance: {formatNumber(Number(balance), 2)}
                  {assetSymbol}
                </span>
              </div>

              {/* Quick Amount Pills */}
              <div className="mb-6 flex gap-3">
                {[2500, 3500, 42500].map((val) => (
                  <div
                    key={val}
                    className="cursor-pointer rounded-full bg-[#FFFFFF14] px-4 py-1.5 text-sm text-white hover:bg-[#FFFFFF33]"
                    onClick={() => handleQuickAmount(val)}
                  >
                    {formatNumber(val)}
                  </div>
                ))}
              </div>

              {/* Reputation Impact Box */}
              <div className="rounded-xl bg-[#1C1C26] p-4 text-base">
                <div className="mb-4 flex items-center gap-2 font-bold">
                  Reputation Impact
                  <Tooltip title="This stake counts toward your reputation requirement. Unstaking takes 7 days before your XNY becomes available again.">
                    <InfoCircleOutlined className="text-[#8D8D93]" />
                  </Tooltip>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#BBBBBE]">Current</span>
                  <span className="font-medium">{currentReputation} pts</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-[#BBBBBE]">After</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{afterReputation} pts</span>
                    {!!reputationImpact && <span className="text-[#00C853]">(+{reputationImpact})</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="mb-12 space-y-4 rounded-xl bg-[#252532] p-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#8D8D93]">Network</span>
                <span>BNB Chain</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8D8D93]">Wallet Address</span>
                <span>{shortenAddress(lastUsedWallet?.address || '', 12)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8D8D93]">Balance</span>
                <span>
                  {formatNumber(Number(balance), 4)}
                  {assetSymbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8D8D93]">Gas Fee</span>
                <span className="text-[#D92B2B]">
                  {loading && !gasFee ? <Loader2 className="size-3 animate-spin" /> : gasFee || '0.0037ETH'}
                </span>
              </div>
            </div>

            <div className="flex w-full justify-center">
              <Button
                type="primary"
                onClick={handleStake}
                disabled={!amount || Number(amount) <= 0 || isInsufficientBalance || loading || !isValidAmount}
                loading={loading}
                className="h-10 w-[240px] rounded-full text-sm disabled:opacity-50"
              >
                Stake {assetSymbol}
              </Button>
            </div>
          </>
        )}

        {viewState === 'success' && (
          <div className="flex flex-col items-center py-12">
            <CheckCircleFilled className="mb-6 text-[64px] text-[#00C853]" />
            <div className="mb-2 text-2xl font-bold text-white">Stake completed</div>
            <div className="mb-2 text-center text-[#BBBBBE]">
              <span className="font-bold text-white">
                {formatNumber(Number(amount))} {assetSymbol}
              </span>{' '}
              has been staked.
            </div>
            <div className="mb-8 text-center text-sm text-[#8D8D93]">
              You can view this stake and your total balance in Staking {'>'} Current staking.
            </div>

            <Button
              type="primary"
              onClick={handleBackToStaking}
              className="h-10 w-[200px] rounded-full bg-[#875DFF] font-bold hover:bg-[#754DEB]"
            >
              Back to staking
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default TokenStakeModal
