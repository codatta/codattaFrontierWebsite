import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import {
  DEPOSIT_HISTORY_URLS,
  EXCHANGE_URLS,
  EXPLORER_ADDRESS_URLS,
  EXPLORER_URLS,
  NETWORK_TOKEN_OPTIONS
} from '@/components/frontier/airdrop/cex-hot-wallet/constants'
import { DepositGuideline } from '@/components/frontier/airdrop/cex-hot-wallet/guideline'
import { ScreenshotUpload } from '@/components/frontier/airdrop/cex-hot-wallet/screenshot-upload'
import { StepContainer } from '@/components/frontier/airdrop/cex-hot-wallet/step-container'
import { SupportedNetworksTip } from '@/components/frontier/airdrop/cex-hot-wallet/supported-networks-tip'
import { DepositFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { ConfigProvider, DatePicker, Input, message, Modal, Radio, Select, Spin, theme } from 'antd'
import type { RadioChangeEvent } from 'antd'
import locale from 'antd/es/date-picker/locale/en_US'
import { isValidCryptoString } from '@/utils/str'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

const { Option } = Select

const AirdropCexDeposit: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // Form State
  const [formData, setFormData] = useState<DepositFormData>({
    exchange_name: '',
    deposit_screenshot: [],
    deposit_network: '',
    deposit_token: '',
    deposit_amount: '',
    deposit_date: '',
    exchange_deposit_address: '',
    deposit_tx_hash: '',
    explorer_screenshot: [],
    deposit_from_address: '',
    deposit_to_address: '',
    has_outgoing_transaction: null,
    outgoing_transaction_screenshot: [],
    outgoing_transaction_hash: '',
    outgoing_tx_screenshot: [],
    outgoing_tx_from_address: '',
    outgoing_tx_to_address: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof DepositFormData, string>>>({})

  // UI State
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')

  // Derived State for Links
  const [exchangeUrl, setExchangeUrl] = useState('')
  const [depositHistoryUrl, setDepositHistoryUrl] = useState('')
  const [explorerUrl, setExplorerUrl] = useState('')
  const [toAddressUrl, setToAddressUrl] = useState('')
  const [outgoingTxUrl, setOutgoingTxUrl] = useState('')
  const [tokenOptions, setTokenOptions] = useState<string[]>([])

  // Load Task
  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) return
    setLoading(true)
    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId)
      // Validation logic if needed
      const totalRewards = taskDetail.data.reward_info
        .filter((item) => item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS')
        .reduce((acc, cur) => acc + cur.reward_value, 0)
      setRewardPoints(totalRewards)
    } catch (error: unknown) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  // Update Links and Options
  useEffect(() => {
    if (formData.exchange_name) {
      setExchangeUrl(EXCHANGE_URLS[formData.exchange_name] || '')
      setDepositHistoryUrl(DEPOSIT_HISTORY_URLS[formData.exchange_name] || '')
    }
  }, [formData.exchange_name])

  useEffect(() => {
    if (formData.deposit_network) {
      setTokenOptions(NETWORK_TOKEN_OPTIONS[formData.deposit_network] || [])
    }
  }, [formData.deposit_network])

  useEffect(() => {
    if (formData.deposit_network && formData.deposit_tx_hash) {
      const url = EXPLORER_URLS[formData.deposit_network]?.replace('{tx}', formData.deposit_tx_hash)
      setExplorerUrl(url || '')
    } else {
      setExplorerUrl('')
    }
  }, [formData.deposit_network, formData.deposit_tx_hash])

  useEffect(() => {
    if (formData.deposit_network && formData.deposit_to_address) {
      const url = EXPLORER_ADDRESS_URLS[formData.deposit_network]?.replace('{address}', formData.deposit_to_address)
      setToAddressUrl(url || '')
    } else {
      setToAddressUrl('')
    }
  }, [formData.deposit_network, formData.deposit_to_address])

  useEffect(() => {
    if (formData.deposit_network && formData.outgoing_transaction_hash) {
      const url = EXPLORER_URLS[formData.deposit_network]?.replace('{tx}', formData.outgoing_transaction_hash)
      setOutgoingTxUrl(url || '')
    } else {
      setOutgoingTxUrl('')
    }
  }, [formData.deposit_network, formData.outgoing_transaction_hash])

  // Handlers
  const handleChange = <K extends keyof DepositFormData>(field: K, value: DepositFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]

      // If changing outgoing transaction toggle or any screenshot, clear "duplicate" errors from all image fields
      // because changing one might resolve the conflict for others.
      const isImageField =
        field === 'deposit_screenshot' ||
        field === 'explorer_screenshot' ||
        field === 'outgoing_transaction_screenshot' ||
        field === 'outgoing_tx_screenshot'

      if (field === 'has_outgoing_transaction' || isImageField) {
        const duplicateErrorMsg = 'Screenshots cannot be the same image'
        const imageFields: (keyof DepositFormData)[] = [
          'deposit_screenshot',
          'explorer_screenshot',
          'outgoing_transaction_screenshot',
          'outgoing_tx_screenshot'
        ]

        imageFields.forEach((imgField) => {
          if (newErrors[imgField] === duplicateErrorMsg) {
            delete newErrors[imgField]
          }
        })
      }

      return newErrors
    })
  }

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DepositFormData, string>> = {}
    let isValid = true

    // Helper to check string emptiness
    const isEmpty = (val: string) => !val || !val.trim()

    // 1. Required fields check
    if (isEmpty(formData.deposit_amount)) newErrors.deposit_amount = 'Deposit Amount is required'
    else if (isNaN(Number(formData.deposit_amount))) newErrors.deposit_amount = 'Amount must be a number'

    if (!formData.deposit_date) newErrors.deposit_date = 'Deposit Date is required'

    // Date validation
    if (formData.deposit_date) {
      const date = new Date(formData.deposit_date)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 30) {
        newErrors.deposit_date = 'Date must be within last 30 days'
      }
    }

    // Address and Hash validation
    if (isEmpty(formData.exchange_deposit_address)) {
      newErrors.exchange_deposit_address = 'Exchange Deposit Address is required'
    } else if (!isValidCryptoString(formData.exchange_deposit_address, 20)) {
      newErrors.exchange_deposit_address = 'Invalid address format (min 20 characters)'
    }

    if (isEmpty(formData.deposit_tx_hash)) {
      newErrors.deposit_tx_hash = 'Deposit TxHash is required'
    } else if (!isValidCryptoString(formData.deposit_tx_hash, 30)) {
      newErrors.deposit_tx_hash = 'Invalid transaction hash format (min 30 characters)'
    }

    if (formData.explorer_screenshot.length === 0)
      newErrors.explorer_screenshot = 'Blockchain Explorer Screenshot is required'

    if (isEmpty(formData.deposit_from_address)) {
      newErrors.deposit_from_address = 'From Address is required'
    } else if (!isValidCryptoString(formData.deposit_from_address, 20)) {
      newErrors.deposit_from_address = 'Invalid address format (min 20 characters)'
    }

    if (isEmpty(formData.deposit_to_address)) {
      newErrors.deposit_to_address = 'To Address is required'
    } else if (!isValidCryptoString(formData.deposit_to_address, 20)) {
      newErrors.deposit_to_address = 'Invalid address format (min 20 characters)'
    }

    // Sender and Receiver address must not be the same
    if (
      !newErrors.deposit_from_address &&
      !newErrors.deposit_to_address &&
      formData.deposit_from_address.trim() === formData.deposit_to_address.trim()
    ) {
      newErrors.deposit_from_address = 'From and To addresses cannot be the same'
      newErrors.deposit_to_address = 'From and To addresses cannot be the same'
    }

    if (!formData.has_outgoing_transaction) {
      newErrors.has_outgoing_transaction = 'Please select an option'
    }

    if (formData.has_outgoing_transaction === 'yes') {
      if (formData.outgoing_transaction_screenshot.length === 0)
        newErrors.outgoing_transaction_screenshot = 'Transaction Screenshot is required'

      if (isEmpty(formData.outgoing_transaction_hash)) {
        newErrors.outgoing_transaction_hash = 'Transaction Hash is required'
      } else if (!isValidCryptoString(formData.outgoing_transaction_hash, 30)) {
        newErrors.outgoing_transaction_hash = 'Invalid transaction hash format (min 30 characters)'
      }

      if (formData.outgoing_tx_screenshot.length === 0)
        newErrors.outgoing_tx_screenshot = 'Transaction Screenshot is required'

      if (isEmpty(formData.outgoing_tx_from_address)) {
        newErrors.outgoing_tx_from_address = 'From Address is required'
      } else if (!isValidCryptoString(formData.outgoing_tx_from_address, 20)) {
        newErrors.outgoing_tx_from_address = 'Invalid address format (min 20 characters)'
      }

      if (isEmpty(formData.outgoing_tx_to_address)) {
        newErrors.outgoing_tx_to_address = 'To Address is required'
      } else if (!isValidCryptoString(formData.outgoing_tx_to_address, 20)) {
        newErrors.outgoing_tx_to_address = 'Invalid address format (min 20 characters)'
      }

      // Check addresses equality for outgoing
      if (
        !newErrors.outgoing_tx_from_address &&
        !newErrors.outgoing_tx_to_address &&
        formData.outgoing_tx_from_address.trim() === formData.outgoing_tx_to_address.trim()
      ) {
        newErrors.outgoing_tx_from_address = 'From and To addresses cannot be the same'
        newErrors.outgoing_tx_to_address = 'From and To addresses cannot be the same'
      }
    }

    // Image hash check
    const hashMap = new Map<string, (keyof DepositFormData)[]>()
    const addImageToCheck = (field: keyof DepositFormData, list: UploadedImage[]) => {
      if (list && list.length > 0 && list[0]?.hash) {
        const hash = list[0].hash
        const fields = hashMap.get(hash) || []
        fields.push(field)
        hashMap.set(hash, fields)
      }
    }

    addImageToCheck('deposit_screenshot', formData.deposit_screenshot)
    addImageToCheck('explorer_screenshot', formData.explorer_screenshot)
    if (formData.has_outgoing_transaction === 'yes') {
      addImageToCheck('outgoing_transaction_screenshot', formData.outgoing_transaction_screenshot)
      addImageToCheck('outgoing_tx_screenshot', formData.outgoing_tx_screenshot)
    }

    hashMap.forEach((fields) => {
      if (fields.length > 1) {
        fields.forEach((field) => {
          newErrors[field] = 'Screenshots cannot be the same image'
        })
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      isValid = false
    } else {
      setErrors({})
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please complete all required fields correctly.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        exchange_name: formData.exchange_name,
        exchange_ui_screenshot_file: formData.deposit_screenshot[0]?.fileName,
        exchange_ui_screenshot_hash: formData.deposit_screenshot[0]?.hash,
        exchange_ui_screenshot_url: formData.deposit_screenshot[0]?.url,
        network: formData.deposit_network,
        token: formData.deposit_token,
        deposit_amount: formData.deposit_amount.trim(),
        deposit_date: formData.deposit_date,
        exchange_deposit_address: formData.exchange_deposit_address.trim(),
        deposit_txhash: formData.deposit_tx_hash.trim(),
        explorer_screenshot_file: formData.explorer_screenshot[0]?.fileName,
        explorer_screenshot_hash: formData.explorer_screenshot[0]?.hash,
        explorer_screenshot_url: formData.explorer_screenshot[0]?.url,
        from_address: formData.deposit_from_address.trim(),
        to_address: formData.deposit_to_address.trim(),
        has_outgoing_transaction: formData.has_outgoing_transaction === 'yes',
        ...(formData.has_outgoing_transaction === 'yes'
          ? {
              outgoing_transaction_screenshot_file: formData.outgoing_transaction_screenshot[0]?.fileName,
              outgoing_transaction_screenshot_hash: formData.outgoing_transaction_screenshot[0]?.hash,
              outgoing_transaction_screenshot_url: formData.outgoing_transaction_screenshot[0]?.url,
              outgoing_transaction_hash: formData.outgoing_transaction_hash.trim(),
              outgoing_tx_screenshot_file: formData.outgoing_tx_screenshot[0]?.fileName,
              outgoing_tx_screenshot_hash: formData.outgoing_tx_screenshot[0]?.hash,
              outgoing_tx_screenshot_url: formData.outgoing_tx_screenshot[0]?.url,
              outgoing_tx_from_address: formData.outgoing_tx_from_address.trim(),
              outgoing_tx_to_address: formData.outgoing_tx_to_address.trim()
            }
          : {})
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

  // Common Input Styles
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
            {/* Header */}
            <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
              <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
                <div
                  className="flex cursor-pointer items-center gap-2 text-sm font-normal text-white hover:opacity-80"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={18} /> Back
                </div>
                CEX Deposit Hot Wallet Collection
                <span className="w-[60px]"></span>
              </h1>
            </div>

            <div className="mt-12 bg-[#FFFFFF0A]">
              <div className="mx-auto max-w-[1320px] px-6">
                <DepositGuideline />
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
              {/* Step 1 */}
              <StepContainer
                step={1}
                title="Confirm Exchange"
                description="Select the exchange where you have deposit records. Ensure deposits are enabled for required networks and tokens."
              >
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
                    {Object.keys(EXCHANGE_URLS).map((ex) => (
                      <Option key={ex} value={ex}>
                        {ex}
                      </Option>
                    ))}
                  </Select>
                  {errors.exchange_name && <p className="text-xs text-red-500">{errors.exchange_name}</p>}
                </div>
              </StepContainer>

              {/* Step 2 */}
              <StepContainer step={2} title="Navigate to Deposit History Page">
                <div className="mb-3 text-[13px] text-white">
                  Navigate to the deposit history page on your exchange.
                </div>
                <div className="space-y-3">
                  <div>
                    <label className={`mb-1 block ${labelClass}`}>Official website</label>
                    <a
                      href={exchangeUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !exchangeUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                      }`}
                    >
                      {exchangeUrl ? (
                        <>
                          <ExternalLink size={14} /> {exchangeUrl.replace('https://', '')}
                        </>
                      ) : (
                        '(Select an exchange to view)'
                      )}
                    </a>
                  </div>
                  <div>
                    <label className={`mb-1 block ${labelClass}`}>Deposit history URL</label>
                    <a
                      href={depositHistoryUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !depositHistoryUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                      }`}
                    >
                      {depositHistoryUrl ? (
                        <>
                          <ExternalLink size={14} /> {depositHistoryUrl.replace('https://', '')}
                        </>
                      ) : (
                        '(Select an exchange to view)'
                      )}
                    </a>
                  </div>
                  <div className="text-[11px] text-[#888]">
                    Note: Links are auto-generated for reference only. If invalid, navigate manually on the exchange
                    website.
                  </div>
                </div>
              </StepContainer>

              {/* Step 3 */}
              <StepContainer
                step={3}
                title="Select Your Deposit Record"
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
                  exampleImage="https://static.codatta.io/static/images/deposit_1_1767511761924.png"
                  value={formData.deposit_screenshot}
                  onChange={(v) => handleChange('deposit_screenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, exchange logo, deposit address, token, amount, and TxHash."
                  error={errors.deposit_screenshot}
                />

                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Network <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select network"
                      value={formData.deposit_network || undefined}
                      onChange={(value) => handleChange('deposit_network', value)}
                      status={errors.deposit_network ? 'error' : ''}
                    >
                      {Object.keys(NETWORK_TOKEN_OPTIONS).map((net) => (
                        <Option key={net} value={net}>
                          {net}
                        </Option>
                      ))}
                    </Select>
                    {errors.deposit_network && <p className="text-xs text-red-500">{errors.deposit_network}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Token <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select token"
                      value={formData.deposit_token || undefined}
                      onChange={(value) => handleChange('deposit_token', value)}
                      disabled={!formData.deposit_network}
                      status={errors.deposit_token ? 'error' : ''}
                    >
                      {tokenOptions.map((t) => (
                        <Option key={t} value={t}>
                          {t}
                        </Option>
                      ))}
                    </Select>
                    {errors.deposit_token && <p className="text-xs text-red-500">{errors.deposit_token}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Deposit Amount <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Deposit amount"
                      value={formData.deposit_amount}
                      onChange={(e) => handleChange('deposit_amount', e.target.value)}
                      status={errors.deposit_amount ? 'error' : ''}
                    />
                    {errors.deposit_amount && <p className="text-xs text-red-500">{errors.deposit_amount}</p>}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Exchange Deposit To Address (Receiver) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Exchange deposit address"
                    value={formData.exchange_deposit_address}
                    onChange={(e) => handleChange('exchange_deposit_address', e.target.value)}
                    status={errors.exchange_deposit_address ? 'error' : ''}
                  />
                  {errors.exchange_deposit_address && (
                    <p className="text-xs text-red-500">{errors.exchange_deposit_address}</p>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Deposit TxHash <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Transaction hash from exchange UI"
                    value={formData.deposit_tx_hash}
                    onChange={(e) => handleChange('deposit_tx_hash', e.target.value)}
                    status={errors.deposit_tx_hash ? 'error' : ''}
                  />
                  {errors.deposit_tx_hash && <p className="text-xs text-red-500">{errors.deposit_tx_hash}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Deposit Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    locale={locale}
                    className={`${inputClass} !flex !w-full`}
                    value={formData.deposit_date ? dayjs(formData.deposit_date) : null}
                    onChange={(_, dateString) => handleChange('deposit_date', dateString as string)}
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(30, 'day')}
                    popupClassName="[&_.ant-picker-panel]:!bg-[#1f1f1f] [&_.ant-picker-header]:!text-white [&_.ant-picker-content_th]:!text-white [&_.ant-picker-cell]:!text-gray-400 [&_.ant-picker-cell-in-view]:!text-white"
                    status={errors.deposit_date ? 'error' : ''}
                  />
                  {errors.deposit_date && <p className="text-xs text-red-500">{errors.deposit_date}</p>}
                  <div className="text-[11px] text-[#888]">Select deposit date (within last 30 days)</div>
                </div>
              </StepContainer>

              {/* Step 4 */}
              <StepContainer step={4} title="Find Transaction on Blockchain Explorer">
                <div className="mb-4">
                  <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">
                    Open deposit transaction on block explorer
                  </label>
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
                      '(Fill Network and Deposit TxHash in Step 3 to view)'
                    )}
                  </a>
                </div>

                <ScreenshotUpload
                  label="Blockchain Explorer Screenshot"
                  exampleImage="https://static.codatta.io/static/images/deposit_2_1767511761924.png"
                  value={formData.explorer_screenshot}
                  onChange={(v) => handleChange('explorer_screenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, TxHash, From address, and To address."
                  error={errors.explorer_screenshot}
                />

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    From (Your Wallet Address) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Your wallet address"
                    value={formData.deposit_from_address}
                    onChange={(e) => handleChange('deposit_from_address', e.target.value)}
                    status={errors.deposit_from_address ? 'error' : ''}
                  />
                  {errors.deposit_from_address && <p className="text-xs text-red-500">{errors.deposit_from_address}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    To (Exchange Deposit Address) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Exchange deposit address"
                    value={formData.deposit_to_address}
                    onChange={(e) => handleChange('deposit_to_address', e.target.value)}
                    status={errors.deposit_to_address ? 'error' : ''}
                  />
                  {errors.deposit_to_address && <p className="text-xs text-red-500">{errors.deposit_to_address}</p>}
                </div>
              </StepContainer>

              {/* Step 5 */}
              <StepContainer
                step={5}
                title="Check if Deposit Address Has Outgoing Transactions"
                warning={
                  <div className="text-[#facc15]">
                    <strong>Note:</strong> Outgoing transactions receive higher rewards. Please verify carefully.
                  </div>
                }
              >
                <div className="mb-4">
                  <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">
                    Open To address on block explorer
                  </label>
                  <a
                    href={toAddressUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                      !toAddressUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                    }`}
                  >
                    {toAddressUrl ? (
                      <>
                        <ExternalLink size={14} /> {toAddressUrl}
                      </>
                    ) : (
                      '(Fill Network and To address in Step 4 to view)'
                    )}
                  </a>
                  <div className="mt-1 text-[11px] text-[#888]">
                    Auto-generated from Step 4. Check for outgoing transactions to identify the hot wallet.
                  </div>
                </div>

                <div className="mb-4 rounded-md border-l-4 border-yellow-500 bg-yellow-500/10 px-3 py-2.5 text-xs text-gray-200">
                  <strong>Note:</strong> Outgoing transactions receive higher rewards. Please verify carefully.
                </div>

                <div className="mb-4 flex items-center gap-5">
                  <span className="text-xs text-white">Any outgoing transaction with amount &gt; 0?</span>
                  <Radio.Group
                    value={formData.has_outgoing_transaction}
                    onChange={(e: RadioChangeEvent) => handleChange('has_outgoing_transaction', e.target.value)}
                    className="flex gap-5"
                  >
                    <Radio value="yes" className="!text-xs !font-medium !text-[#d0d0d0]">
                      Yes
                    </Radio>
                    <Radio value="no" className="!text-xs !font-medium !text-[#d0d0d0]">
                      No
                    </Radio>
                  </Radio.Group>
                  {errors.has_outgoing_transaction && (
                    <p className="text-xs text-red-500">{errors.has_outgoing_transaction}</p>
                  )}
                </div>

                {formData.has_outgoing_transaction === 'yes' && (
                  <div className="animate-fade-down animate-duration-300">
                    <ScreenshotUpload
                      label="Transaction Screenshot"
                      exampleImage="https://static.codatta.io/static/images/deposit_3_1767511761924.png"
                      value={formData.outgoing_transaction_screenshot}
                      onChange={(v) => handleChange('outgoing_transaction_screenshot', v)}
                      onShowModal={showImageModal}
                      hint="Full-page screenshot including: URL, TxHash, From/To addresses, and amount."
                      error={errors.outgoing_transaction_screenshot}
                    />
                    <div className="mt-3 flex flex-col gap-2">
                      <label className={labelClass}>
                        Transaction Hash <span className="text-red-500">*</span>
                      </label>
                      <Input
                        className={inputClass}
                        placeholder="Outgoing transaction hash"
                        value={formData.outgoing_transaction_hash}
                        onChange={(e) => handleChange('outgoing_transaction_hash', e.target.value)}
                        status={errors.outgoing_transaction_hash ? 'error' : ''}
                      />
                      {errors.outgoing_transaction_hash && (
                        <p className="text-xs text-red-500">{errors.outgoing_transaction_hash}</p>
                      )}
                    </div>
                  </div>
                )}
              </StepContainer>

              {/* Step 6 */}
              {formData.has_outgoing_transaction === 'yes' && (
                <StepContainer step={6} title="Submit Outgoing Transaction Details">
                  <div className="mb-4">
                    <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">
                      Open outgoing transaction on block explorer
                    </label>
                    <a
                      href={outgoingTxUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !outgoingTxUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                      }`}
                    >
                      {outgoingTxUrl ? (
                        <>
                          <ExternalLink size={14} /> {outgoingTxUrl}
                        </>
                      ) : (
                        '(Fill Network and Transaction Hash in Step 5 to view)'
                      )}
                    </a>
                  </div>

                  <ScreenshotUpload
                    label="Transaction Screenshot"
                    exampleImage="https://static.codatta.io/static/images/deposit_4_1767511761924.png"
                    value={formData.outgoing_tx_screenshot}
                    onChange={(v) => handleChange('outgoing_tx_screenshot', v)}
                    onShowModal={showImageModal}
                    hint="Full-page screenshot including: URL, TxHash, From address, and To address."
                    error={errors.outgoing_tx_screenshot}
                  />

                  <div className="mt-3 flex flex-col gap-2">
                    <label className={labelClass}>
                      From (Exchange Deposit Address) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Exchange deposit address"
                      value={formData.outgoing_tx_from_address}
                      onChange={(e) => handleChange('outgoing_tx_from_address', e.target.value)}
                      status={errors.outgoing_tx_from_address ? 'error' : ''}
                    />
                    {errors.outgoing_tx_from_address && (
                      <p className="text-xs text-red-500">{errors.outgoing_tx_from_address}</p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2">
                    <label className={labelClass}>
                      To (Exchange Hot Wallet) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Exchange hot wallet address"
                      value={formData.outgoing_tx_to_address}
                      onChange={(e) => handleChange('outgoing_tx_to_address', e.target.value)}
                      status={errors.outgoing_tx_to_address ? 'error' : ''}
                    />
                    {errors.outgoing_tx_to_address && (
                      <p className="text-xs text-red-500">{errors.outgoing_tx_to_address}</p>
                    )}
                  </div>
                </StepContainer>
              )}

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

export default AirdropCexDeposit

// http://localhost:5175/app/frontier/project/AIRDROP_CEX_HOT_WALLET_DEPOSIT/9498244436600105722
