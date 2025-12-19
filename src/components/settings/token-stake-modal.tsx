import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { Button, Input, Modal, message, Tooltip, Spin } from 'antd'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'
import { keccak256, stringToHex, parseEther, formatEther, createPublicClient, http } from 'viem'
import { Loader2 } from 'lucide-react'

import { TaskStakeInfo } from '@/apis/frontiter.api'
import userApi from '@/apis/user.api'
import { formatNumber } from '@/utils/str'
import { shortenAddress } from '@/utils/wallet-address'
import StakingContract, { STAKE_ASSET_TYPE, STAKE_TOKEN_ADRRESS } from '@/contracts/staking.abi'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useContractWrite } from '@/hooks/use-contract-write'

interface TokenStakeModalProps {
  open: boolean
  onClose: () => void
  taskStakeInfo?: TaskStakeInfo
  onSuccess?: () => void
}

type ViewState = 'input' | 'success'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

const TokenStakeModal: React.FC<TokenStakeModalProps> = ({ open, onClose, taskStakeInfo, onSuccess }) => {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [viewState, setViewState] = useState<ViewState>('input')
  const [amount, setAmount] = useState<string>('')
  const [uid, setUid] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [allowance, setAllowance] = useState<bigint>(0n)
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [fetchingUid, setFetchingUid] = useState(false)
  const assetSymbol = STAKE_ASSET_TYPE
  const debouncedAmount = useDebounce(amount, 500)

  // const assetSymbol = useMemo(() => {
  //   return taskStakeInfo?.stake_asset_type === 'XnYCoin' ? 'XNY' : taskStakeInfo?.stake_asset_type || 'XNY'
  // }, [taskStakeInfo])

  const tokenAddress = STAKE_TOKEN_ADRRESS

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setViewState('input')
      setAmount('')
      setUid('')
    }
  }, [open])

  // Fetch Token Balance and Allowance
  const fetchTokenInfo = useCallback(async () => {
    if (!open || !lastUsedWallet?.address || !tokenAddress || /^0x0+$/.test(tokenAddress)) {
      setBalance('0')
      setAllowance(0n)
      return
    }

    setLoadingBalance(true)
    try {
      const publicClient = createPublicClient({
        chain: StakingContract.chain,
        transport: http()
      })

      const [bal, allow] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [lastUsedWallet.address as `0x${string}`]
        }),
        publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'allowance',
          args: [lastUsedWallet.address as `0x${string}`, StakingContract.address as `0x${string}`]
        })
      ])

      setBalance(formatEther(bal))
      setAllowance(allow)
    } catch (error) {
      console.error('Failed to fetch token info:', error)
    } finally {
      setLoadingBalance(false)
    }
  }, [open, lastUsedWallet, tokenAddress])

  useEffect(() => {
    fetchTokenInfo()
  }, [fetchTokenInfo])

  // Fetch UID from backend
  useEffect(() => {
    let active = true

    async function fetchUid() {
      if (!debouncedAmount || Number(debouncedAmount) <= 0 || !lastUsedWallet?.address || !taskStakeInfo) {
        setUid('')
        return
      }

      setFetchingUid(true)
      setUid('') // Clear stale UID
      try {
        const res = await userApi.getStakeUid({
          asset_type: taskStakeInfo.stake_asset_type,
          amount: debouncedAmount,
          address: lastUsedWallet.address
        })
        if (active) {
          setUid(res.uid)
        }
      } catch (error) {
        console.error('Failed to get stake UID:', error)
        if (active) {
          setUid('')
        }
      } finally {
        if (active) {
          setFetchingUid(false)
        }
      }
    }
    fetchUid()

    return () => {
      active = false
    }
  }, [debouncedAmount, lastUsedWallet, taskStakeInfo])

  // Contract Args for Stake
  const stakeArgs = useMemo(() => {
    if (!uid || !debouncedAmount) return []
    try {
      return [keccak256(stringToHex(uid)), parseEther(debouncedAmount)]
    } catch {
      return []
    }
  }, [uid, debouncedAmount])

  // Gas Estimation for Stake
  const {
    balance: nativeBalance,
    estimateGas: stakeGasFee,
    gasWarning,
    loading: gasLoading
  } = useGasEstimation({
    address: lastUsedWallet?.address as `0x${string}`,
    contract: StakingContract,
    functionName: 'stake',
    contractArgs: stakeArgs
  })

  // Contract Write Hook
  const {
    writeContract,
    isLoading: isWriting,
    tip: writeTip
  } = useContractWrite({
    onStepChange: async (step, data) => {
      if (step === 'success') {
        if (uid && amount && lastUsedWallet?.address) {
          const txHash = (data as { hash: string }).hash
          await userApi.recordStakeTransaction({
            uid,
            asset_type: taskStakeInfo?.stake_asset_type || '',
            amount,
            address: lastUsedWallet.address,
            tx_hash: txHash,
            gas_fee: stakeGasFee // Use estimated gas as record
          })
          setViewState('success')
          onSuccess?.()
        }
      }
    }
  })

  // Approve Logic
  const [approving, setApproving] = useState(false)
  const handleApprove = async () => {
    if (!tokenAddress || !amount) return
    setApproving(true)
    try {
      const publicClient = createPublicClient({
        chain: StakingContract.chain,
        transport: http()
      })

      // Use wallet client to write
      if (!lastUsedWallet?.client) throw new Error('Wallet not connected')

      const hash = await lastUsedWallet.client.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [StakingContract.address as `0x${string}`, parseEther(amount)],
        chain: StakingContract.chain,
        account: lastUsedWallet.address as `0x${string}`
      })

      message.loading({ content: 'Approving...', key: 'approve' })
      await publicClient.waitForTransactionReceipt({ hash })
      message.success({ content: 'Approved successfully', key: 'approve' })

      // Refresh allowance
      fetchTokenInfo()
    } catch (error) {
      console.error(error)
      message.error('Approve failed')
    } finally {
      setApproving(false)
    }
  }

  const handleStake = async () => {
    if (!stakeArgs.length) return

    try {
      await writeContract({
        contract: StakingContract,
        functionName: 'stake',
        args: stakeArgs
      })
    } catch (error) {
      console.error(error)
      // message.error('Stake failed') // handled by useContractWrite
    }
  }

  const handleMax = () => {
    setAmount(balance)
  }

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString())
  }

  const handleBackToStaking = () => {
    setViewState('input')
    setAmount('')
    setUid('')
    onClose()
  }

  const minStake = 1000 // Configurable?
  const isInsufficientBalance = Number(amount) > Number(balance)
  const isValidAmount = Number(amount) >= minStake
  const needsApprove = useMemo(() => {
    if (!amount) return false
    try {
      return allowance < parseEther(amount)
    } catch {
      return false
    }
  }, [allowance, amount])

  const currentReputation = formatNumber(taskStakeInfo?.user_reputation || 0, 2)
  const afterReputation = formatNumber(taskStakeInfo?.user_reputation_new || 0, 2)
  const reputationImpact = formatNumber(
    (taskStakeInfo?.user_reputation_new || 0) - (taskStakeInfo?.user_reputation || 0),
    2
  )

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      centered
      closable={!isWriting && !approving}
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
      <Spin spinning={isWriting || approving} tip={approving ? 'Approving...' : writeTip}>
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
                <Input
                  value={amount}
                  disabled={isWriting || approving}
                  onChange={(event) => {
                    const val = event.target.value
                    if (/^\d*\.?\d*$/.test(val)) setAmount(val)
                  }}
                  className="mb-2 h-[62px] rounded-lg border border-[#FFFFFF1F] bg-transparent p-0 px-4 text-[28px] font-bold text-white placeholder:text-[#FFFFFF4D] disabled:bg-[#FFFFFF0A] disabled:text-[#FFFFFF4D]"
                  placeholder="0.00"
                  suffix={
                    <div className="text-sm font-normal">
                      <span className="mr-3 text-base">${assetSymbol}</span>
                      <Button
                        onClick={handleMax}
                        disabled={isWriting || approving}
                        className="h-[38px] rounded-full border-none bg-[#FFFFFF14] text-white hover:bg-[#FFFFFF33] disabled:bg-transparent disabled:text-[#FFFFFF4D]"
                      >
                        MAX
                      </Button>
                    </div>
                  }
                />
                {isInsufficientBalance && <div className="mb-2 text-sm text-[#D92B2B]">Insufficient balance.</div>}

                <div className="mb-3 flex items-center justify-between text-base text-[#77777D]">
                  <span>
                    Min stake: {formatNumber(minStake, 2)} {assetSymbol}
                  </span>
                  <span>
                    Balance:{' '}
                    {loadingBalance ? (
                      <Loader2 className="inline size-3 animate-spin" />
                    ) : (
                      formatNumber(Number(balance), 2)
                    )}
                    {assetSymbol}
                  </span>
                </div>

                {/* Quick Amount Pills */}
                <div className="mb-6 flex gap-3">
                  {[2500, 3500, 42500].map((val) => (
                    <Button
                      key={val}
                      disabled={isWriting || approving}
                      className="h-8 cursor-pointer rounded-full border-none bg-[#FFFFFF14] px-4 py-1.5 text-sm text-white hover:bg-[#FFFFFF33] disabled:bg-[#FFFFFF0A] disabled:text-[#FFFFFF4D]"
                      onClick={() => handleQuickAmount(val)}
                    >
                      {formatNumber(val)}
                    </Button>
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
                  <span>{StakingContract.chain.name}</span>
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
                {!tokenAddress && (
                  <div className="flex items-center justify-end text-xs text-[#D92B2B]">
                    * Token contract not configured
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#8D8D93]">Balance(for gas)</span>
                  <span className={gasWarning ? 'text-[#D92B2B]' : ''}>
                    {gasLoading && !nativeBalance ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      `${formatNumber(Number(nativeBalance || 0), 4)} ${StakingContract.chain.nativeCurrency.symbol}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8D8D93]">Gas Fee</span>
                  <span className={gasWarning ? 'text-[#D92B2B]' : 'text-[#FFA800]'}>
                    {gasLoading ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : stakeGasFee ? (
                      `${stakeGasFee} ${StakingContract.chain.nativeCurrency.symbol}`
                    ) : (
                      '--'
                    )}
                  </span>
                </div>
                {gasWarning && <div className="text-right text-[#D92B2B]">{gasWarning}</div>}
              </div>

              {/* Warning for unsupported token */}
              {!tokenAddress && (
                <div className="mb-6 flex gap-3 rounded-xl border border-[#D92B2B]/20 bg-[#D92B2B]/10 p-3 text-sm text-[#D92B2B]">
                  <InfoCircleOutlined className="mt-0.5 text-lg" />
                  <p>Token contract not available on this network.</p>
                </div>
              )}

              <div className="flex w-full justify-center">
                {needsApprove ? (
                  <Button
                    type="primary"
                    onClick={handleApprove}
                    disabled={!tokenAddress || !amount || Number(amount) <= 0 || isInsufficientBalance || approving}
                    loading={approving}
                    className="h-10 w-[240px] rounded-full text-sm disabled:opacity-50"
                  >
                    Approve {assetSymbol}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleStake}
                    disabled={
                      !tokenAddress ||
                      !amount ||
                      amount !== debouncedAmount ||
                      Number(amount) <= 0 ||
                      isInsufficientBalance ||
                      isWriting ||
                      !isValidAmount ||
                      !uid ||
                      !!gasWarning ||
                      fetchingUid ||
                      gasLoading
                    }
                    loading={isWriting}
                    className="h-10 w-[240px] rounded-full text-sm disabled:opacity-50"
                  >
                    {fetchingUid ? 'Preparing...' : gasLoading ? 'Calculating Gas...' : `Stake ${assetSymbol}`}
                  </Button>
                )}
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
      </Spin>
    </Modal>
  )
}

export default TokenStakeModal
