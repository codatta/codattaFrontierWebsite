import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { Button, Input, Modal, Tooltip, Spin, message } from 'antd'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'
import { parseEther } from 'viem'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import frontierApi, { TaskStakeInfo, StakeReputationInfo } from '@/apis/frontiter.api'
import userApi from '@/apis/user.api'
import { formatNumber } from '@/utils/str'
import { shortenAddress } from '@/utils/wallet-address'
import StakingContract, { STAKE_ASSET_TYPE, STAKE_TOKEN_ADRRESS } from '@/contracts/staking.abi'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useTokenContract, ERC20_ABI } from '@/hooks/use-token-contract'
import { useContractWrite } from '@/hooks/use-contract-write'

// ==========================================
// Types
// ==========================================

export interface TaskStakeConfig extends TaskStakeInfo {
  frontierUrl?: string
  taskUrl?: string
}

interface TokenStakeModalProps {
  open: boolean
  onClose?: () => void
  onSuccess?: () => void
  taskStakeConfig?: Partial<TaskStakeConfig>
}

type ViewState = 'input' | 'success'

// ==========================================
// Helper Hooks
// ==========================================

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

// ==========================================
// Main Logic Hook
// ==========================================

const useStakeLogic = ({ open, taskStakeConfig, onSuccess }: TokenStakeModalProps) => {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [viewState, setViewState] = useState<ViewState>('input')
  const [amount, setAmount] = useState<string>('')
  const [isAmountLocked, setIsAmountLocked] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const [uid, setUid] = useState<string>('')
  const [fetchingUid, setFetchingUid] = useState(false)
  const [calculatedReputation, setCalculatedReputation] = useState<StakeReputationInfo | null>(null)
  const [calculatingReputation, setCalculatingReputation] = useState(false)

  const debouncedAmount = useDebounce(amount, 500)
  const assetSymbol = STAKE_ASSET_TYPE
  const minStakeAmount = taskStakeConfig?.stake_amount || 0
  const isFromTask = !!taskStakeConfig?.taskUrl

  // 1. Token Info (Balance & Allowance)
  const {
    balance,
    allowance,
    loading: loadingBalance,
    refetch: fetchTokenInfo
  } = useTokenContract({
    tokenAddress: STAKE_TOKEN_ADRRESS,
    ownerAddress: lastUsedWallet?.address || undefined,
    spenderAddress: StakingContract.address,
    chain: StakingContract.chain,
    enabled: open
  })

  // 2. Computed Values
  const isInsufficientBalance = useMemo(() => {
    return Number(amount) > Number(balance)
  }, [amount, balance])

  const isValidAmount = useMemo(() => {
    return Number(amount) >= Number(minStakeAmount)
  }, [amount, minStakeAmount])

  const isDebouncedAmountValid = useMemo(() => {
    if (!debouncedAmount || Number(debouncedAmount) <= 0) return false
    if (Number(debouncedAmount) > Number(balance)) return false
    if (Number(debouncedAmount) < Number(minStakeAmount)) return false
    return true
  }, [debouncedAmount, balance, minStakeAmount])

  const needsApprove = useMemo(() => {
    if (!amount) return false
    try {
      return allowance < parseEther(amount)
    } catch {
      return false
    }
  }, [allowance, amount])

  const stakeArgs = useMemo(() => {
    if (!uid || !debouncedAmount) return []
    return [uid, parseEther(debouncedAmount)]
  }, [uid, debouncedAmount])

  const tokenContract = useMemo(
    () => ({
      abi: ERC20_ABI,
      chain: StakingContract.chain,
      address: STAKE_TOKEN_ADRRESS || ''
    }),
    []
  )

  // 3. Effects

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    }
  }, [])

  // Calculate Reputation
  useEffect(() => {
    async function calculate() {
      if (!taskStakeConfig?.stake_asset_type) return

      setCalculatingReputation(true)
      try {
        const res = await frontierApi.calculateStakeReputation(taskStakeConfig.stake_asset_type, debouncedAmount || '0')
        if (res.success) {
          setCalculatedReputation(res.data)
        }
      } catch (error) {
        console.error('Failed to calculate reputation:', error)
      } finally {
        setCalculatingReputation(false)
      }
    }

    calculate()
  }, [debouncedAmount, taskStakeConfig])

  // Fetch UID
  useEffect(() => {
    let active = true

    async function fetchUid() {
      if (!isDebouncedAmountValid || !lastUsedWallet?.address || !taskStakeConfig) {
        setUid('')
        return
      }

      setFetchingUid(true)
      setUid('')
      try {
        const res = await userApi.getStakeUid({
          asset_type: taskStakeConfig?.stake_asset_type || '',
          amount: debouncedAmount,
          address: lastUsedWallet.address
        })

        if (active) {
          setUid(res.uid)
        }
      } catch (error) {
        console.error('Failed to get stake UID:', error)
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
  }, [isDebouncedAmountValid, debouncedAmount, lastUsedWallet, taskStakeConfig])

  // 4. Contract Interactions

  // Gas Estimation
  const gasEstimationParams = useMemo(() => {
    const emptyParams = {
      contract: StakingContract,
      functionName: 'stake',
      contractArgs: []
    }

    if (!isDebouncedAmountValid) return emptyParams

    if (needsApprove) {
      const approveAmount = Math.max(Number(debouncedAmount), 1e10).toString()
      return {
        contract: tokenContract,
        functionName: 'approve',
        contractArgs: [StakingContract.address, parseEther(approveAmount)]
      }
    } else {
      return {
        contract: StakingContract,
        functionName: 'stake',
        contractArgs: stakeArgs
      }
    }
  }, [isDebouncedAmountValid, needsApprove, tokenContract, debouncedAmount, stakeArgs])

  const {
    balance: nativeBalance,
    estimateGas: gasFee,
    gasWarning,
    loading: gasLoading
  } = useGasEstimation({
    address: lastUsedWallet?.address as `0x${string}`,
    ...gasEstimationParams
  })

  // Write: Stake
  const {
    writeContract: writeStake,
    isLoading: isStaking,
    tip: stakeTip,
    reset: resetStake,
    step: stakeStep
  } = useContractWrite({
    onStepChange: async (step, data) => {
      if (step === 'success') {
        if (uid && amount && lastUsedWallet?.address) {
          const txHash = (data as { hash: string }).hash
          await userApi.recordStakeTransaction({
            uid,
            asset_type: taskStakeConfig?.stake_asset_type || '',
            amount,
            address: lastUsedWallet.address,
            tx_hash: txHash,
            gas_fee: gasFee
          })
          setViewState('success')
          onSuccess?.()
        }
      }
    }
  })

  // Write: Approve
  const {
    writeContract: writeApprove,
    isLoading: isApproving,
    tip: approveTip,
    reset: resetApprove,
    step: approveStep
  } = useContractWrite({
    onStepChange: async (step) => {
      if (step === 'success') {
        fetchTokenInfo()
        setIsAmountLocked(true)
      }
    }
  })

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setViewState('input')
      setAmount('')
      setIsAmountLocked(false)
      setErrorMsg('')
      setUid('')
      setCalculatedReputation(null)
      resetStake()
      resetApprove()
    }
  }, [open, resetStake, resetApprove])

  // 5. Handlers
  const handleError = (msg: string) => {
    setErrorMsg(msg)
    message.error(msg)
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMsg('')
    }, 2000)
  }

  const handleApprove = async () => {
    if (!STAKE_TOKEN_ADRRESS || !amount) return
    setErrorMsg('')
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)

    try {
      const approveAmount = Number(amount) > 10000 ? amount : '10000'
      await writeApprove({
        contract: tokenContract,
        functionName: 'approve',
        args: [StakingContract.address, parseEther(approveAmount)]
      })
    } catch (error) {
      console.error(error)
      handleError('Transaction failed. Please try again.')
    }
  }

  const handleStake = async () => {
    if (!stakeArgs.length) return
    setErrorMsg('')
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)

    try {
      await writeStake({
        contract: StakingContract,
        functionName: 'stake',
        args: stakeArgs
      })
    } catch (error) {
      console.error(error)
      handleError('Transaction failed. Please try again.')
    }
  }

  const handleMax = () => setAmount(balance)
  const handleQuickAmount = (val: number) => setAmount(String((val * Number(balance)) / 4))

  return {
    state: {
      viewState,
      amount,
      isAmountLocked,
      errorMsg,
      uid,
      fetchingUid,
      calculatedReputation,
      calculatingReputation,
      isInsufficientBalance,
      isValidAmount,
      needsApprove,
      isFromTask,
      lastUsedWallet,
      debouncedAmount,
      assetSymbol,
      minStakeAmount,
      taskStakeConfig
    },
    contracts: {
      balance,
      nativeBalance,
      loadingBalance,
      gasFee,
      gasWarning,
      gasLoading,
      isStaking,
      isApproving,
      approveTip,
      stakeTip,
      stakeStep,
      approveStep
    },
    handlers: {
      setAmount,
      handleApprove,
      handleStake,
      handleMax,
      handleQuickAmount,
      setViewState
    }
  }
}

// ==========================================
// Sub-Components
// ==========================================

// 1. Reputation Impact Component
const ReputationImpactSection = ({ logic }: { logic: ReturnType<typeof useStakeLogic> }) => {
  const { state } = logic
  const { calculatedReputation, calculatingReputation, taskStakeConfig } = state

  const currentReputation = formatNumber(
    calculatedReputation?.user_reputation ?? taskStakeConfig?.user_reputation ?? 0,
    2
  )
  const afterReputation = formatNumber(
    calculatedReputation?.user_reputation_new ?? taskStakeConfig?.user_reputation_new ?? 0,
    2
  )
  const reputationImpact = formatNumber(
    (calculatedReputation?.user_reputation_new ?? taskStakeConfig?.user_reputation_new ?? 0) -
      (calculatedReputation?.user_reputation ?? taskStakeConfig?.user_reputation ?? 0),
    2
  )

  return (
    <div className="rounded-xl bg-[#1C1C26] p-4 text-base">
      <div className="mb-4 flex items-center gap-2 font-bold">
        Reputation Impact
        <Tooltip
          title={`This stake counts toward your reputation requirement. Unstaking takes 7 days before your ${STAKE_ASSET_TYPE} becomes available again.`}
        >
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
          {calculatingReputation ? (
            <Loader2 className="size-4 animate-spin text-[#875DFF]" />
          ) : (
            <>
              <span className="text-base">{afterReputation} pts</span>
              {!!reputationImpact && <span className="text-[#00C853]">(+{reputationImpact})</span>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// 2. Info Section Component
const InfoSection = ({ logic }: { logic: ReturnType<typeof useStakeLogic> }) => {
  const { state, contracts } = logic
  const { lastUsedWallet } = state
  const { nativeBalance, gasFee, gasWarning, gasLoading } = contracts

  return (
    <div className="mb-12 space-y-4 rounded-xl bg-[#252532] p-6 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-[#8D8D93]">Network</span>
        <span>{StakingContract.chain.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#8D8D93]">Wallet Address</span>
        <span>{shortenAddress(lastUsedWallet?.address || '', 12)}</span>
      </div>
      {!STAKE_TOKEN_ADRRESS && (
        <div className="flex items-center justify-end text-xs text-[#D92B2B]">* Token contract not configured</div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-[#8D8D93]">Balance</span>
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
          ) : gasFee ? (
            `${gasFee} ${StakingContract.chain.nativeCurrency.symbol}`
          ) : (
            '--'
          )}
        </span>
      </div>
      {gasWarning && <div className="text-right text-[#D92B2B]">{gasWarning}</div>}
    </div>
  )
}

// 3. Main Input View
const StakeInputView = ({ logic }: { logic: ReturnType<typeof useStakeLogic> }) => {
  const { state, contracts, handlers } = logic
  const {
    amount,
    debouncedAmount,
    isAmountLocked,
    errorMsg,
    isInsufficientBalance,
    isValidAmount,
    minStakeAmount,
    assetSymbol,
    needsApprove,
    uid,
    fetchingUid
  } = state
  const { balance, loadingBalance, isStaking, isApproving, gasWarning, gasLoading, stakeStep, approveStep } = contracts
  const { setAmount, handleMax, handleQuickAmount, handleApprove, handleStake } = handlers

  const isLoading = isStaking || isApproving
  const isDisabled = isLoading || isAmountLocked

  return (
    <>
      <div className="mb-6 text-[#A0A0B0]">Lock {assetSymbol} to boost your reputation across activities.</div>

      <div className="mb-6 rounded-xl bg-[#252532] p-6 text-sm">
        {/* Stake Amount Input */}
        <div className="mb-2 text-base font-bold">Stake amount</div>
        <Input
          value={amount}
          disabled={isDisabled}
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
                disabled={isDisabled}
                className="h-[38px] rounded-full border-none bg-[#FFFFFF14] text-white hover:bg-[#FFFFFF33] disabled:bg-transparent disabled:text-[#FFFFFF4D]"
              >
                MAX
              </Button>
            </div>
          }
        />
        {isInsufficientBalance && (
          <div className="mb-2 text-sm text-[#D92B2B]">
            Insufficient {assetSymbol} balance. Get more {assetSymbol} to continue.
          </div>
        )}
        {!isValidAmount && Number(amount) > 0 && (
          <div className="mb-2 text-sm text-[#D92B2B]">
            Minimum stake amount is {formatNumber(minStakeAmount, 2)} {assetSymbol}.
          </div>
        )}

        <div className="mb-3 flex items-center justify-between text-base text-[#77777D]">
          <span className={minStakeAmount === 0 ? 'invisible' : ''}>
            Min stake: {formatNumber(minStakeAmount, 2)} {assetSymbol}
          </span>
          <span>
            Balance:{' '}
            {loadingBalance ? <Loader2 className="inline size-3 animate-spin" /> : formatNumber(Number(balance), 2)}
            {assetSymbol}
          </span>
        </div>

        {/* Quick Amount Pills */}
        <div className="mb-6 flex gap-3">
          {[1, 2, 3].map((val) => (
            <Button
              key={val}
              disabled={isDisabled}
              className="h-8 cursor-pointer rounded-full border-none bg-[#FFFFFF14] px-4 py-1.5 text-sm text-white hover:bg-[#FFFFFF33] disabled:bg-[#FFFFFF0A] disabled:text-[#FFFFFF4D]"
              onClick={() => handleQuickAmount(val)}
            >
              {val}/4
            </Button>
          ))}
        </div>

        {/* Reputation Impact Box */}
        <ReputationImpactSection logic={logic} />
      </div>

      {/* Info Section */}
      <InfoSection logic={logic} />

      {/* Warning for unsupported token */}
      {!STAKE_TOKEN_ADRRESS && (
        <div className="mb-6 flex gap-3 rounded-xl border border-[#D92B2B]/20 bg-[#D92B2B]/10 p-3 text-sm text-[#D92B2B]">
          <InfoCircleOutlined className="mt-0.5 text-lg" />
          <p>Token contract not available on this network.</p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-6 flex items-center justify-center gap-2 text-sm text-[#D92B2B]">
          <InfoCircleOutlined />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex w-full flex-col items-center justify-center">
        {needsApprove ? (
          <>
            <Button
              type="primary"
              onClick={handleApprove}
              disabled={
                !STAKE_TOKEN_ADRRESS ||
                !amount ||
                amount !== debouncedAmount ||
                Number(amount) <= 0 ||
                isInsufficientBalance ||
                !isValidAmount ||
                !!gasWarning ||
                isApproving ||
                gasLoading ||
                approveStep === 'success'
              }
              loading={isApproving}
              className="h-10 w-[240px] rounded-full text-sm disabled:opacity-50"
            >
              {gasLoading ? 'Calculating Gas...' : `Approve ${assetSymbol} (1/2)`}
            </Button>
            <div className="mt-2 text-center text-xs text-[#8D8D93]">
              You’ll be asked to confirm twice in your wallet.
            </div>
          </>
        ) : (
          <Button
            type="primary"
            onClick={handleStake}
            disabled={
              !STAKE_TOKEN_ADRRESS ||
              !amount ||
              amount !== debouncedAmount ||
              Number(amount) <= 0 ||
              isInsufficientBalance ||
              isStaking ||
              !isValidAmount ||
              !uid ||
              !!gasWarning ||
              fetchingUid ||
              gasLoading ||
              stakeStep === 'success'
            }
            loading={isStaking}
            className="h-10 w-[240px] rounded-full text-sm disabled:opacity-50"
          >
            {/* {fetchingUid ? 'Preparing...' : gasLoading ? 'Calculating Gas...' : `Stake ${assetSymbol}`} */}
            {fetchingUid ? 'Preparing...' : gasLoading ? 'Calculating Gas...' : `Stake ${assetSymbol} (2/2)`}
          </Button>
        )}
      </div>
    </>
  )
}

// 4. Success View
const StakeSuccessView = ({ logic, onClose }: { logic: ReturnType<typeof useStakeLogic>; onClose?: () => void }) => {
  const { state, handlers } = logic
  const { amount, assetSymbol, isFromTask, taskStakeConfig } = state
  const { setViewState, setAmount } = handlers
  const navigate = useNavigate()

  const handleReset = useCallback(() => {
    setViewState('input')
    setAmount('')
    // Logic hook state reset is handled, but here we might want to close or just reset view
  }, [setAmount, setViewState])

  const handleGoToTask = () => {
    handleReset()
    if (taskStakeConfig?.taskUrl) {
      navigate(taskStakeConfig.taskUrl)
    }
    onClose?.()
  }

  const handleGoToTaskList = () => {
    handleReset()
    onClose?.()
  }

  const handleGoToStaking = () => {
    handleReset()
    onClose?.()
  }

  return (
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
        {isFromTask ? (
          <>Your eligibility for this task will be updated in the background.</>
        ) : (
          <>You can view this stake and your total balance in Staking {'>'} Current staking.</>
        )}
      </div>

      {isFromTask ? (
        <>
          <Button
            type="primary"
            onClick={handleGoToTask}
            className="h-10 w-[200px] cursor-pointer rounded-full bg-[#875DFF] font-semibold hover:bg-[#754DEB]"
          >
            Go to task
          </Button>
          <Button
            type="text"
            className="mt-2 h-10 w-[200px] cursor-pointer rounded-full font-semibold text-[#875DFF] hover:bg-[#754DEB] hover:text-white"
            onClick={handleGoToTaskList}
          >
            Back to task list
          </Button>
        </>
      ) : (
        <>
          <Button
            type="primary"
            onClick={handleGoToStaking}
            className="h-10 w-[200px] cursor-pointer rounded-full bg-[#875DFF] font-semibold hover:bg-[#754DEB]"
          >
            Back to staking
          </Button>
        </>
      )}
    </div>
  )
}

// ==========================================
// Main Component
// ==========================================

const TokenStakeModal: React.FC<TokenStakeModalProps> = (props) => {
  const { open, onClose } = props

  // Combine props with logic
  // We pass props directly to logic hook
  const logic = useStakeLogic(props)
  const { state, contracts } = logic
  const { viewState, assetSymbol } = state
  const { isStaking, isApproving, approveTip, stakeTip } = contracts

  const isLoading = isStaking || isApproving

  const handleModalClose = () => {
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onCancel={handleModalClose}
      footer={null}
      width={620}
      centered
      closable={!isLoading && !state.isAmountLocked}
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
      <Spin spinning={isLoading} tip={isApproving ? approveTip : stakeTip}>
        {/* Header */}
        <div className="relative border-b border-[#FFFFFF1F] p-4 text-center">
          <div className="text-lg font-bold text-white">Stake {assetSymbol}</div>
        </div>

        <div className="p-6">
          {viewState === 'input' && <StakeInputView logic={logic} />}
          {viewState === 'success' && <StakeSuccessView logic={logic} onClose={handleModalClose} />}
        </div>
      </Spin>
    </Modal>
  )
}

export default TokenStakeModal
