import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import {
  getExchanges,
  getExplorerUrl,
  NETWORKS,
  ExchangeItem
} from '@/components/frontier/airdrop/cex-hot-wallet/constants'
import { WithdrawGuideline } from '@/components/frontier/airdrop/cex-hot-wallet/guideline'
import { ScreenshotUpload } from '@/components/frontier/airdrop/cex-hot-wallet/screenshot-upload'
import { StepContainer } from '@/components/frontier/airdrop/cex-hot-wallet/step-container'
import { SupportedNetworksTip } from '@/components/frontier/airdrop/cex-hot-wallet/supported-networks-tip'
import { WithdrawFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { isValidCryptoString } from '@/utils/str'
import { ConfigProvider, DatePicker, Input, message, Modal, Select, Spin, theme } from 'antd'
import locale from 'antd/es/date-picker/locale/en_US'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const { Option } = Select

const AirdropCexWithdraw: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // Form State
  const [formData, setFormData] = useState<WithdrawFormData>({
    exchange_name: '',
    exchange_screenshot: [],
    network: '',
    coin: '',
    amount: '',
    network_fee: '',
    address: '',
    tx_hash: '',
    transaction_date: '',
    explorer_screenshot: [],
    sender_address: '',
    receiver_address: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof WithdrawFormData, string>>>({})

  // Field validation state
  const validationTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const validationAbortControllers = useRef<Record<string, AbortController>>({})
  const validationResults = useRef<Record<string, { result: number; msg: string }>>({})
  const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set())

  // UI State
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')

  // Derived State
  const [explorerUrl, setExplorerUrl] = useState('')
  const [coinOptions, setCoinOptions] = useState<string[]>([])
  const [exchanges, setExchanges] = useState<ExchangeItem[]>([])
  const [exchange, setExchange] = useState<ExchangeItem | null>(null)

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) return
    setLoading(true)
    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId)
      const totalRewards = taskDetail.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)
      const exchangeGroup = Number(
        (taskDetail.data.data_requirements as unknown as { exchange_group: number }).exchange_group ?? 1
      )
      console.log('exchangeGroup', exchangeGroup, 'exchanges', getExchanges(exchangeGroup, 10))
      setRewardPoints(totalRewards)
      setExchanges(getExchanges(exchangeGroup, 10))
    } catch (error: unknown) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  useEffect(() => {
    if (formData.exchange_name) {
      const exchange = exchanges.find((item) => item.name === formData.exchange_name)
      setExchange(exchange || null)
    }
  }, [formData.exchange_name, exchanges])

  useEffect(() => {
    if (formData.network) {
      const network = NETWORKS.find((n) => n.name === formData.network)
      setCoinOptions(network?.coin_options || [])
    }
  }, [formData.network])

  useEffect(() => {
    if (formData.network && formData.tx_hash) {
      const url = getExplorerUrl(formData.network, formData.tx_hash)
      setExplorerUrl(url || '')
    } else {
      setExplorerUrl('')
    }
  }, [formData.network, formData.tx_hash])

  const validateField = useCallback(
    async (field: 'tx_hash' | 'sender_address', value: string) => {
      if (!taskId || !value.trim()) return

      // Abort previous validation for this field
      if (validationAbortControllers.current[field]) {
        validationAbortControllers.current[field].abort()
      }

      const abortController = new AbortController()
      validationAbortControllers.current[field] = abortController

      setValidatingFields((prev) => new Set(prev).add(field))

      try {
        const result = await frontiterApi.checkTaskField(taskId, field, value.trim())

        // Check if this validation was aborted
        if (abortController.signal.aborted) return

        // Store validation result
        validationResults.current[field] = {
          result: result.data.result,
          msg: result.data.msg
        }

        if (result.data.result !== 1 && result.data.msg) {
          if (result.data.result === 2) {
            message.error(result.data.msg)
          } else if (result.data.result === 3) {
            message.warning(result.data.msg)
          }
        }
      } catch (error) {
        if (abortController.signal.aborted) return
        console.error(`Field validation error for ${field}:`, error)
      } finally {
        if (!abortController.signal.aborted) {
          setValidatingFields((prev) => {
            const newSet = new Set(prev)
            newSet.delete(field)
            return newSet
          })
        }
      }
    },
    [taskId]
  )

  const handleChange = <K extends keyof WithdrawFormData>(field: K, value: WithdrawFormData[K]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (field === 'network') {
        newData.coin = ''
      }
      return newData
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Watch tx_hash field changes and validate
  useEffect(() => {
    const trimmedValue = formData.tx_hash.trim()

    // Clear validation result when field changes
    delete validationResults.current.tx_hash

    // Clear existing timer
    if (validationTimers.current.tx_hash) {
      clearTimeout(validationTimers.current.tx_hash)
    }

    // Abort ongoing validation
    if (validationAbortControllers.current.tx_hash) {
      validationAbortControllers.current.tx_hash.abort()
      setValidatingFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete('tx_hash')
        return newSet
      })
    }

    // Only validate if value is valid format
    if (trimmedValue && isValidCryptoString(trimmedValue, 30)) {
      validationTimers.current.tx_hash = setTimeout(() => {
        validateField('tx_hash', trimmedValue)
      }, 1000)
    }
  }, [formData.tx_hash, validateField])

  // Watch sender_address field changes and validate
  useEffect(() => {
    const trimmedValue = formData.sender_address.trim()

    // Clear validation result when field changes
    delete validationResults.current.sender_address

    // Clear existing timer
    if (validationTimers.current.sender_address) {
      clearTimeout(validationTimers.current.sender_address)
    }

    // Abort ongoing validation
    if (validationAbortControllers.current.sender_address) {
      validationAbortControllers.current.sender_address.abort()
      setValidatingFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete('sender_address')
        return newSet
      })
    }

    // Only validate if value is valid format
    if (trimmedValue && isValidCryptoString(trimmedValue, 20)) {
      validationTimers.current.sender_address = setTimeout(() => {
        validateField('sender_address', trimmedValue)
      }, 1000)
    }
  }, [formData.sender_address, validateField])

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = validationTimers.current
    const controllers = validationAbortControllers.current
    return () => {
      Object.values(timers).forEach(clearTimeout)
      Object.values(controllers).forEach((controller) => controller.abort())
    }
  }, [])

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof WithdrawFormData, string>> = {}
    let isValid = true

    // Helper to check string emptiness
    const isEmpty = (val: string) => !val || !val.trim()

    // 1. Required fields check
    if (!formData.exchange_name) newErrors.exchange_name = 'Exchange Name is required'
    if (formData.exchange_screenshot.length === 0) newErrors.exchange_screenshot = 'Exchange UI Screenshot is required'
    if (!formData.network) newErrors.network = 'Network is required'
    if (!formData.coin) newErrors.coin = 'Coin is required'

    if (isEmpty(formData.amount)) {
      newErrors.amount = 'Withdraw Amount is required'
    } else if (isNaN(Number(formData.amount))) {
      // 2. Amount must be a number
      newErrors.amount = 'Amount must be a number'
    }

    if (isEmpty(formData.network_fee)) {
      newErrors.network_fee = 'Network Fee is required'
    } else if (isNaN(Number(formData.network_fee))) {
      // 2. Network fee must be a number
      newErrors.network_fee = 'Network Fee must be a number'
    }

    // 3. Address and Hash format check
    if (isEmpty(formData.address)) {
      newErrors.address = 'Withdrawal Address is required'
    } else if (!isValidCryptoString(formData.address, 20)) {
      newErrors.address = 'Invalid address format (min 20 characters, alphanumeric only)'
    }

    if (isEmpty(formData.tx_hash)) {
      newErrors.tx_hash = 'Transaction Hash is required'
    } else if (!isValidCryptoString(formData.tx_hash, 30)) {
      newErrors.tx_hash = 'Invalid transaction hash format (min 30 characters, alphanumeric only)'
    } else if (validationResults.current.tx_hash?.result !== 1 && validationResults.current.tx_hash?.msg) {
      // Show error for both result=2 (fail) and result=3 (partial pass)
      newErrors.tx_hash = validationResults.current.tx_hash.msg
    }

    if (!formData.transaction_date) newErrors.transaction_date = 'Transaction Date is required'

    // Date validation
    if (formData.transaction_date) {
      const date = new Date(formData.transaction_date)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 30) {
        newErrors.transaction_date = 'Date must be within last 30 days'
      }
    }

    if (formData.explorer_screenshot.length === 0)
      newErrors.explorer_screenshot = 'Blockchain Explorer Screenshot is required'

    if (isEmpty(formData.sender_address)) {
      newErrors.sender_address = 'Sender Address is required'
    } else if (!isValidCryptoString(formData.sender_address, 20)) {
      newErrors.sender_address = 'Invalid address format (min 20 characters, alphanumeric only)'
    } else if (
      validationResults.current.sender_address?.result !== 1 &&
      validationResults.current.sender_address?.msg
    ) {
      // Show error for both result=2 (fail) and result=3 (partial pass)
      newErrors.sender_address = validationResults.current.sender_address.msg
    }

    if (isEmpty(formData.receiver_address)) {
      newErrors.receiver_address = 'Receiver Address is required'
    } else if (!isValidCryptoString(formData.receiver_address, 20)) {
      newErrors.receiver_address = 'Invalid address format (min 20 characters, alphanumeric only)'
    }

    // 4. Sender Address and Receiver Address must not be the same
    if (
      !newErrors.sender_address &&
      !newErrors.receiver_address &&
      formData.sender_address.trim() === formData.receiver_address.trim()
    ) {
      newErrors.sender_address = 'Sender and Receiver addresses cannot be the same'
      newErrors.receiver_address = 'Sender and Receiver addresses cannot be the same'
    }

    // 5. Image hash check
    if (formData.exchange_screenshot.length > 0 && formData.explorer_screenshot.length > 0) {
      const exchangeImg = formData.exchange_screenshot[0]
      const explorerImg = formData.explorer_screenshot[0]
      if (exchangeImg.hash && explorerImg.hash && exchangeImg.hash === explorerImg.hash) {
        newErrors.exchange_screenshot = 'Screenshots cannot be the same image'
        newErrors.explorer_screenshot = 'Screenshots cannot be the same image'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      isValid = false
    } else {
      setErrors({})
    }

    return isValid
  }

  const handleSubmit = async () => {
    // Check if validation is in progress
    if (validatingFields.size > 0) {
      const fieldNames = Array.from(validatingFields).map((f) => {
        if (f === 'tx_hash') return 'Transaction Hash'
        if (f === 'sender_address') return 'Sender Address'
        return f
      })
      message.warning(`Please wait for validation to complete: ${fieldNames.join(', ')}`)
      return
    }

    if (!validateForm()) {
      message.error('Please complete all required fields correctly.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        type: 'withdrawal',
        exchange_name: formData.exchange_name,
        exchange_ui_screenshot_file: formData.exchange_screenshot[0]?.fileName,
        exchange_ui_screenshot_hash: formData.exchange_screenshot[0]?.hash,
        exchange_ui_screenshot_url: formData.exchange_screenshot[0]?.url,
        network: formData.network,
        coin: formData.coin,
        amount: formData.amount.trim(),
        network_fee: formData.network_fee.trim(),
        address: formData.address.trim(),
        tx_hash: formData.tx_hash.trim(),
        transaction_date: formData.transaction_date,
        explorer_screenshot_file: formData.explorer_screenshot[0]?.fileName,
        explorer_screenshot_hash: formData.explorer_screenshot[0]?.hash,
        explorer_screenshot_url: formData.explorer_screenshot[0]?.url,
        sender_address: formData.sender_address.trim(),
        receiver_address: formData.receiver_address.trim()
      }

      await frontiterApi.submitTask(taskId!, {
        data: payload,
        templateId: templateId,
        taskId: taskId
      })
      setModalShow(true)
    } catch (error: unknown) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit!'
      message.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    '!w-full !rounded-lg !border-none !bg-white/5 !px-4 !py-3 !text-white !transition-colors placeholder:!text-gray-500 hover:!bg-white/10 focus:!border-blue-500 focus:!outline-none !text-xs'

  const selectClass =
    'w-full [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!text-white [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center'

  const labelClass = 'text-xs font-medium text-[#d0d0d0]'

  return (
    <AuthChecker>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            Select: {
              optionSelectedBg: 'rgba(255, 255, 255, 0.1)',
              optionActiveBg: 'rgba(255, 255, 255, 0.05)'
            },
            DatePicker: {
              cellActiveWithRangeBg: 'rgba(59, 130, 246, 0.3)',
              cellHoverWithRangeBg: 'rgba(59, 130, 246, 0.2)'
            }
          }
        }}
      >
        <Spin spinning={loading} className="min-h-screen">
          <div className="min-h-screen py-3 md:py-8">
            <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
              <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
                <div
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal text-white hover:opacity-80"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={18} /> Back
                </div>
                CEX Withdrawal Hot Wallet Collection
                <span className="w-[60px]"></span>
              </h1>
            </div>

            <div className="mt-12 bg-[#FFFFFF0A]">
              <div className="mx-auto max-w-[1320px] px-6">
                <WithdrawGuideline />
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
              {/* Step 1 */}
              <StepContainer step={1} title="Confirm Exchange">
                <div className="mb-3 text-[13px] text-white">
                  Select the exchange where you have withdrawal records. Ensure withdrawals are enabled for required
                  networks and tokens.
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>
                    Exchange Name <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className={selectClass}
                    popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                    placeholder="Select exchange"
                    value={formData.exchange_name || undefined}
                    onChange={(value) => handleChange('exchange_name', value)}
                    status={errors.exchange_name ? 'error' : ''}
                  >
                    {exchanges.map((exchange) => (
                      <Option key={exchange.name} value={exchange.name}>
                        {exchange.name}
                      </Option>
                    ))}
                  </Select>
                  {errors.exchange_name && <p className="text-xs text-red-500">{errors.exchange_name}</p>}
                </div>
              </StepContainer>

              {/* Step 2 */}
              <StepContainer
                step={2}
                title="Navigate to Withdrawal History Page"
                description="Navigate to the withdrawal history page on your exchange."
              >
                <div className="space-y-3">
                  <div>
                    <label className={`mb-1 block ${labelClass}`}>Official website</label>
                    <a
                      href={exchange?.official_website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !exchange?.official_website
                          ? 'pointer-events-none opacity-70'
                          : 'hover:bg-sky-400/20 hover:text-sky-100'
                      }`}
                    >
                      {exchange?.official_website ? (
                        <>
                          <ExternalLink size={14} /> {exchange?.official_website.replace('https://', '')}
                        </>
                      ) : (
                        '(Select an exchange to view)'
                      )}
                    </a>
                  </div>
                  <div>
                    <label className={`mb-1 block ${labelClass}`}>Withdrawal history URL</label>
                    <a
                      href={exchange?.withdrawal_history_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !exchange?.withdrawal_history_url
                          ? 'pointer-events-none opacity-70'
                          : 'hover:bg-sky-400/20 hover:text-sky-100'
                      }`}
                    >
                      {exchange?.withdrawal_history_url ? (
                        <>
                          <ExternalLink size={14} /> {exchange?.withdrawal_history_url.replace('https://', '')}
                        </>
                      ) : (
                        '(Navigate manually on the exchange website)'
                      )}
                    </a>
                  </div>
                </div>
              </StepContainer>

              {/* Step 3 */}
              <StepContainer
                step={3}
                title="Select Your Withdrawal Record"
                warning={
                  <div>
                    <div className="font-bold">Requirements:</div>
                    <ul className="mb-2 list-none pl-4 text-xs">
                      <li className="relative pl-0 before:absolute before:-left-3 before:content-['•']">
                        Within last 30 days
                      </li>
                      <li className="relative pl-0 before:absolute before:-left-3 before:content-['•']">
                        Supported Network/Token
                      </li>
                    </ul>
                    <SupportedNetworksTip />
                  </div>
                }
              >
                <ScreenshotUpload
                  label="Exchange UI Screenshot"
                  exampleImage="https://static.codatta.io/static/images/withdraw_1_1767511761924.png"
                  value={formData.exchange_screenshot}
                  onChange={(v) => handleChange('exchange_screenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, exchange logo, withdrawal address, token, amount, date/time, and TxHash."
                  error={errors.exchange_screenshot}
                />

                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Network <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select network"
                      value={formData.network || undefined}
                      onChange={(value) => handleChange('network', value)}
                      status={errors.network ? 'error' : ''}
                    >
                      {NETWORKS.map((network) => (
                        <Option key={network.name} value={network.name}>
                          {network.name}
                        </Option>
                      ))}
                    </Select>
                    {errors.network && <p className="text-xs text-red-500">{errors.network}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Coin <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select coin"
                      value={formData.coin || undefined}
                      onChange={(value) => handleChange('coin', value)}
                      disabled={!formData.network}
                      status={errors.coin ? 'error' : ''}
                    >
                      {coinOptions.map((t) => (
                        <Option key={t} value={t}>
                          {t}
                        </Option>
                      ))}
                    </Select>
                    {errors.coin && <p className="text-xs text-red-500">{errors.coin}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Withdraw Amount <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Exact withdrawal amount from the record"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      status={errors.amount ? 'error' : ''}
                    />
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Network Fee <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Network fee / withdrawal fee"
                      value={formData.network_fee}
                      onChange={(e) => handleChange('network_fee', e.target.value)}
                      status={errors.network_fee ? 'error' : ''}
                    />
                    {errors.network_fee && <p className="text-xs text-red-500">{errors.network_fee}</p>}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Your Withdrawal Wallet Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Your wallet address that received the withdrawal"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    status={errors.address ? 'error' : ''}
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Transaction Hash (TxHash) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Transaction hash from the exchange"
                    value={formData.tx_hash}
                    onChange={(e) => handleChange('tx_hash', e.target.value)}
                    status={errors.tx_hash ? 'error' : ''}
                  />
                  {errors.tx_hash && <p className="text-xs text-red-500">{errors.tx_hash}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Transaction Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    locale={locale}
                    className={`${inputClass} !flex !w-full`}
                    value={formData.transaction_date ? dayjs(formData.transaction_date) : null}
                    onChange={(_, dateString) => handleChange('transaction_date', dateString as string)}
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(30, 'day')}
                    popupClassName="[&_.ant-picker-panel]:!bg-[#1f1f1f] [&_.ant-picker-header]:!text-white [&_.ant-picker-content_th]:!text-white [&_.ant-picker-cell]:!text-gray-400 [&_.ant-picker-cell-in-view]:!text-white"
                    status={errors.transaction_date ? 'error' : ''}
                  />
                  {errors.transaction_date && <p className="text-xs text-red-500">{errors.transaction_date}</p>}
                </div>
              </StepContainer>

              {/* Step 4 */}
              <StepContainer
                step={4}
                title="Find Transaction on Blockchain Explorer"
                description="Open the withdrawal transaction on the block explorer to verify details."
              >
                <div className="mb-4">
                  <a
                    href={explorerUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                      !explorerUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                    }`}
                  >
                    {explorerUrl ? (
                      <>
                        <ExternalLink size={14} /> {explorerUrl}
                      </>
                    ) : (
                      '(Fill Network and Transaction Hash in Step 3 to view)'
                    )}
                  </a>
                </div>

                <ScreenshotUpload
                  label="Blockchain Explorer Screenshot"
                  exampleImage="https://static.codatta.io/static/images/withdraw_2_1767511761924.png"
                  value={formData.explorer_screenshot}
                  onChange={(v) => handleChange('explorer_screenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, TxHash, From address, and To address."
                  error={errors.explorer_screenshot}
                />

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Sender Address (From) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Hot wallet address that sent the funds"
                    value={formData.sender_address}
                    onChange={(e) => handleChange('sender_address', e.target.value)}
                    status={errors.sender_address ? 'error' : ''}
                  />
                  {errors.sender_address && <p className="text-xs text-red-500">{errors.sender_address}</p>}
                  <div className="text-[11px] text-[#888]">
                    This is the hot wallet address controlled by the exchange
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Receiver Address (To) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Your wallet address that received the funds"
                    value={formData.receiver_address}
                    onChange={(e) => handleChange('receiver_address', e.target.value)}
                    status={errors.receiver_address ? 'error' : ''}
                  />
                  {errors.receiver_address && <p className="text-xs text-red-500">{errors.receiver_address}</p>}
                </div>
              </StepContainer>

              <div className="mt-12 bg-[#D92B2B0A]">
                <div className="mx-auto max-w-[1320px] px-6">
                  <ExpertRedline />
                </div>
              </div>

              <div className="mt-12 flex justify-center pb-20">
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  className="h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:w-[240px]"
                  text="Submit"
                />
              </div>
            </div>

            <Modal
              open={imageModalVisible}
              footer={null}
              onCancel={() => setImageModalVisible(false)}
              width="90%"
              centered
              styles={{
                content: { backgroundColor: 'transparent', boxShadow: 'none' },
                body: { padding: 0, display: 'flex', justifyContent: 'center' }
              }}
              closeIcon={
                <span className="flex size-10 items-center justify-center rounded-full bg-[#8b5cf64d] text-2xl text-white hover:bg-[#8b5cf699]">
                  ×
                </span>
              }
            >
              <img src={modalImageSrc} alt="Preview" className="max-h-[90vh] max-w-full rounded-xl" />
            </Modal>

            <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
          </div>
        </Spin>
      </ConfigProvider>
    </AuthChecker>
  )
}

export default AirdropCexWithdraw
// http://localhost:5175/app/frontier/project/AIRDROP_CEX_HOT_WALLET_WITHDRAW/9498241470700105721
