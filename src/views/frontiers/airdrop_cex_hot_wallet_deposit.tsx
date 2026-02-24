import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import {
  getExchanges,
  getExplorerUrl,
  getExplorerAddressUrl,
  NETWORKS,
  ExchangeItem
} from '@/components/frontier/airdrop/cex-hot-wallet/constants'
import { DepositGuideline } from '@/components/frontier/airdrop/cex-hot-wallet/guideline'
import { ScreenshotUpload } from '@/components/frontier/airdrop/cex-hot-wallet/screenshot-upload'
import { StepContainer } from '@/components/frontier/airdrop/cex-hot-wallet/step-container'
import { DepositFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'
import { isValidCryptoString } from '@/utils/validation'

import { ConfigProvider, DatePicker, Input, message, Modal, Radio, Select, Spin, theme } from 'antd'
import type { RadioChangeEvent } from 'antd'
import locale from 'antd/es/date-picker/locale/en_US'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const { Option } = Select

const AirdropCexDeposit: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // Form State
  const [formData, setFormData] = useState<DepositFormData>({
    exchange_name: '',
    screenshot: [],
    network: '',
    token: '',
    amount: '',
    date: '',
    exchange_address: '',
    tx_hash: '',
    explorer_screenshot: [],
    from_address: '',
    to_address: '',
    has_outgoing_transaction: null,
    outgoing_transaction_screenshot: [],
    outgoing_transaction_hash: '',
    outgoing_tx_screenshot: [],
    outgoing_tx_from_address: '',
    outgoing_tx_to_address: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof DepositFormData, string>>>({})

  // Field validation state
  const validationTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const validationAbortControllers = useRef<Record<string, AbortController>>({})
  const [validationResults, setValidationResults] = useState<Record<string, { result: number; msg: string }>>({})
  const [validatingFields, setValidatingFields] = useState<Set<string>>(new Set())

  // UI State
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')

  // Derived State for Links
  const [exchanges, setExchanges] = useState<ExchangeItem[]>([])
  const [exchange, setExchange] = useState<ExchangeItem | null>(null)
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
      const exchangeGroup = Number(
        (taskDetail.data.data_requirements as unknown as { exchange_group: number }).exchange_group ?? 1
      )
      console.log('exchange_group', exchangeGroup)
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

  // Update Links and Options
  useEffect(() => {
    if (formData.exchange_name) {
      const exchange = exchanges.find((item) => item.name === formData.exchange_name)
      setExchange(exchange || null)
    }
  }, [formData.exchange_name, exchanges])

  useEffect(() => {
    if (formData.network) {
      const network = NETWORKS.find((n) => n.name === formData.network)
      setTokenOptions(network?.token_options || [])
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

  useEffect(() => {
    if (formData.network && formData.to_address) {
      const url = getExplorerAddressUrl(formData.network, formData.to_address)
      setToAddressUrl(url || '')
    } else {
      setToAddressUrl('')
    }
  }, [formData.network, formData.to_address])

  useEffect(() => {
    if (formData.network && formData.outgoing_transaction_hash) {
      const url = getExplorerUrl(formData.network, formData.outgoing_transaction_hash)
      setOutgoingTxUrl(url || '')
    } else {
      setOutgoingTxUrl('')
    }
  }, [formData.network, formData.outgoing_transaction_hash])

  const validateField = useCallback(
    async (field: 'tx_hash' | 'outgoing_transaction_hash' | 'outgoing_tx_to_address', value: string) => {
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
        setValidationResults((prev) => ({
          ...prev,
          [field]: {
            result: result.data.result,
            msg: result.data.msg
          }
        }))
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

  // Watch tx_hash field changes and validate
  useEffect(() => {
    const trimmedValue = formData.tx_hash.trim()

    // Clear validation result and format error when field changes
    setValidationResults((prev) => {
      const next = { ...prev }
      delete next.tx_hash
      return next
    })
    setErrors((prev) => (prev.tx_hash ? { ...prev, tx_hash: undefined } : prev))

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

    if (trimmedValue) {
      validationTimers.current.tx_hash = setTimeout(() => {
        if (isValidCryptoString(trimmedValue, 30)) {
          // Format valid, call check API
          validateField('tx_hash', trimmedValue)
        } else {
          // Format invalid, show error
          setErrors((prev) => ({
            ...prev,
            tx_hash: 'Invalid transaction hash format (min 30 characters, alphanumeric only)'
          }))
        }
      }, 1000)
    }
  }, [formData.tx_hash, validateField])

  // Watch outgoing_transaction_hash field changes and validate
  useEffect(() => {
    const trimmedValue = formData.outgoing_transaction_hash.trim()

    // Clear validation result and format error when field changes
    setValidationResults((prev) => {
      const next = { ...prev }
      delete next.outgoing_transaction_hash
      return next
    })
    setErrors((prev) => (prev.outgoing_transaction_hash ? { ...prev, outgoing_transaction_hash: undefined } : prev))

    // Clear existing timer
    if (validationTimers.current.outgoing_transaction_hash) {
      clearTimeout(validationTimers.current.outgoing_transaction_hash)
    }

    // Abort ongoing validation
    if (validationAbortControllers.current.outgoing_transaction_hash) {
      validationAbortControllers.current.outgoing_transaction_hash.abort()
      setValidatingFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete('outgoing_transaction_hash')
        return newSet
      })
    }

    if (trimmedValue) {
      validationTimers.current.outgoing_transaction_hash = setTimeout(() => {
        if (isValidCryptoString(trimmedValue, 30)) {
          // Format valid, call check API
          validateField('outgoing_transaction_hash', trimmedValue)
        } else {
          // Format invalid, show error
          setErrors((prev) => ({
            ...prev,
            outgoing_transaction_hash: 'Invalid transaction hash format (min 30 characters, alphanumeric only)'
          }))
        }
      }, 1000)
    }
  }, [formData.outgoing_transaction_hash, validateField])

  // Watch outgoing_tx_to_address field changes and validate
  useEffect(() => {
    const trimmedValue = formData.outgoing_tx_to_address.trim()

    // Clear validation result and format error when field changes
    setValidationResults((prev) => {
      const next = { ...prev }
      delete next.outgoing_tx_to_address
      return next
    })
    setErrors((prev) => (prev.outgoing_tx_to_address ? { ...prev, outgoing_tx_to_address: undefined } : prev))

    // Clear existing timer
    if (validationTimers.current.outgoing_tx_to_address) {
      clearTimeout(validationTimers.current.outgoing_tx_to_address)
    }

    // Abort ongoing validation
    if (validationAbortControllers.current.outgoing_tx_to_address) {
      validationAbortControllers.current.outgoing_tx_to_address.abort()
      setValidatingFields((prev) => {
        const newSet = new Set(prev)
        newSet.delete('outgoing_tx_to_address')
        return newSet
      })
    }

    if (trimmedValue) {
      validationTimers.current.outgoing_tx_to_address = setTimeout(() => {
        if (isValidCryptoString(trimmedValue, 20)) {
          // Format valid, call check API
          validateField('outgoing_tx_to_address', trimmedValue)
        } else {
          // Format invalid, show error
          setErrors((prev) => ({
            ...prev,
            outgoing_tx_to_address: 'Invalid address format (min 20 characters, alphanumeric only)'
          }))
        }
      }, 1000)
    }
  }, [formData.outgoing_tx_to_address, validateField])

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = validationTimers.current
    const controllers = validationAbortControllers.current
    return () => {
      Object.values(timers).forEach(clearTimeout)
      Object.values(controllers).forEach((controller) => controller.abort())
    }
  }, [])

  // Handlers
  const handleChange = <K extends keyof DepositFormData>(field: K, value: DepositFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]

      // If changing outgoing transaction toggle or any screenshot, clear "duplicate" errors from all image fields
      // because changing one might resolve the conflict for others.
      const isImageField =
        field === 'screenshot' ||
        field === 'explorer_screenshot' ||
        field === 'outgoing_transaction_screenshot' ||
        field === 'outgoing_tx_screenshot'

      if (field === 'has_outgoing_transaction' || isImageField) {
        const duplicateErrorMsg = 'Screenshots cannot be the same image'
        const imageFields: (keyof DepositFormData)[] = [
          'screenshot',
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
    if (isEmpty(formData.exchange_name)) newErrors.exchange_name = 'Exchange Name is required'

    if (formData.screenshot.length === 0) newErrors.screenshot = 'Exchange UI Screenshot is required'

    if (isEmpty(formData.network)) newErrors.network = 'Network is required'

    if (isEmpty(formData.token)) newErrors.token = 'Token is required'

    if (isEmpty(formData.amount)) newErrors.amount = 'Deposit Amount is required'
    else if (isNaN(Number(formData.amount))) newErrors.amount = 'Amount must be a number'

    if (!formData.date) newErrors.date = 'Deposit Date is required'

    // Address and Hash validation
    if (isEmpty(formData.exchange_address)) {
      newErrors.exchange_address = 'Exchange Deposit Address is required'
    } else if (!isValidCryptoString(formData.exchange_address, 20)) {
      newErrors.exchange_address = 'Invalid address format (min 20 characters)'
    }

    if (isEmpty(formData.tx_hash)) {
      newErrors.tx_hash = 'Deposit TxHash is required'
    } else if (!isValidCryptoString(formData.tx_hash, 30)) {
      newErrors.tx_hash = 'Invalid transaction hash format (min 30 characters)'
    } else if (validationResults.tx_hash?.result === 2 && validationResults.tx_hash?.msg) {
      // Only block submission for result=2 (fail)
      newErrors.tx_hash = validationResults.tx_hash.msg
    }

    if (formData.explorer_screenshot.length === 0)
      newErrors.explorer_screenshot = 'Blockchain Explorer Screenshot is required'

    if (isEmpty(formData.from_address)) {
      newErrors.from_address = 'From Address is required'
    } else if (!isValidCryptoString(formData.from_address, 20)) {
      newErrors.from_address = 'Invalid address format (min 20 characters)'
    }

    if (isEmpty(formData.to_address)) {
      newErrors.to_address = 'To Address is required'
    } else if (!isValidCryptoString(formData.to_address, 20)) {
      newErrors.to_address = 'Invalid address format (min 20 characters)'
    }

    // Sender and Receiver address must not be the same
    if (
      !newErrors.from_address &&
      !newErrors.to_address &&
      formData.from_address.trim() === formData.to_address.trim()
    ) {
      newErrors.from_address = 'From and To addresses cannot be the same'
      newErrors.to_address = 'From and To addresses cannot be the same'
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
      } else if (
        validationResults.outgoing_transaction_hash?.result === 2 &&
        validationResults.outgoing_transaction_hash?.msg
      ) {
        // Only block submission for result=2 (fail)
        newErrors.outgoing_transaction_hash = validationResults.outgoing_transaction_hash.msg
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
      } else if (
        validationResults.outgoing_tx_to_address?.result === 2 &&
        validationResults.outgoing_tx_to_address?.msg
      ) {
        // Only block submission for result=2 (fail)
        newErrors.outgoing_tx_to_address = validationResults.outgoing_tx_to_address.msg
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

    addImageToCheck('screenshot', formData.screenshot)
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
    // Check if validation is in progress
    if (validatingFields.size > 0) {
      const fieldNames = Array.from(validatingFields).map((f) => {
        if (f === 'tx_hash') return 'Deposit TxHash'
        if (f === 'outgoing_transaction_hash') return 'Outgoing Transaction Hash'
        if (f === 'outgoing_tx_to_address') return 'Outgoing To Address'
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
        type: 'deposit',
        exchange_name: formData.exchange_name,
        exchange_ui_screenshot_file: formData.screenshot[0]?.fileName,
        exchange_ui_screenshot_hash: formData.screenshot[0]?.hash,
        exchange_ui_screenshot_url: formData.screenshot[0]?.url,
        network: formData.network,
        token: formData.token,
        amount: formData.amount.trim(),
        date: formData.date,
        exchange_address: formData.exchange_address.trim(),
        tx_hash: formData.tx_hash.trim(),
        explorer_screenshot_file: formData.explorer_screenshot[0]?.fileName,
        explorer_screenshot_hash: formData.explorer_screenshot[0]?.hash,
        explorer_screenshot_url: formData.explorer_screenshot[0]?.url,
        from_address: formData.from_address.trim(),
        to_address: formData.to_address.trim(),
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

  const inputClass =
    '!w-full !rounded-lg !px-4 !py-3 !text-white !transition-colors placeholder:!text-gray-500 hover:!bg-white/10 focus:!border-blue-500 focus:!outline-none !text-xs'

  const selectClass =
    'w-full [&_.ant-select-selector]:!text-white [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:block [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center '

  const labelClass = 'text-sm font-medium text-white'

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
              <StepContainer title="Confirm Exchange">
                <div className="space-y-2">
                  <label className={labelClass}>
                    Exchange Name <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className={selectClass}
                    popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                    placeholder="Select the exchange where you have deposit records. Ensure deposits are enabled for required networks and tokens."
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
              <StepContainer title="Navigate to Deposit History Page">
                <div className="space-y-3">
                  <div>
                    <label className={`mb-2 block ${labelClass}`}>Official website</label>
                    {exchange?.official_website ? (
                      <a
                        href={exchange.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center gap-2 rounded-lg border border-[#FFFFFF1F] bg-[#FFFFFF1F] px-4 leading-[46px] text-white"
                      >
                        <ExternalLink size={14} /> {exchange.official_website.replace('https://', '')}
                      </a>
                    ) : (
                      <div className="h-12 rounded-lg border border-[#FFFFFF1F] px-4 leading-[46px] text-[#606067]">
                        Select an exchange to view
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block ${labelClass}`}>Deposit history URL</label>
                    {exchange?.deposit_history_url ? (
                      <a
                        href={exchange.deposit_history_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center gap-2 rounded-lg border border-[#FFFFFF1F] bg-[#FFFFFF1F] px-4 leading-[46px] text-white"
                      >
                        <ExternalLink size={14} /> {exchange.deposit_history_url.replace('https://', '')}
                      </a>
                    ) : (
                      <div className="h-12 rounded-lg border border-[#FFFFFF1F] px-4 leading-[46px] text-[#606067]">
                        Select an exchange to view
                      </div>
                    )}
                  </div>
                </div>
              </StepContainer>

              {/* Step 3 */}
              <StepContainer title="Deposit Record">
                <ScreenshotUpload
                  label="Exchange UI Screenshot"
                  exampleImage="https://static.codatta.io/static/images/deposit_1_1767511761924.png"
                  value={formData.screenshot}
                  onChange={(v) => handleChange('screenshot', v)}
                  onShowModal={showImageModal}
                  error={errors.screenshot}
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
                      Token <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select token"
                      value={formData.token || undefined}
                      onChange={(value) => handleChange('token', value)}
                      disabled={!formData.network}
                      status={errors.token ? 'error' : ''}
                    >
                      {tokenOptions.map((t) => (
                        <Option key={t} value={t}>
                          {t}
                        </Option>
                      ))}
                    </Select>
                    {errors.token && <p className="text-xs text-red-500">{errors.token}</p>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Deposit Amount <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Deposit amount"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      status={errors.amount ? 'error' : ''}
                    />
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Exchange Deposit Address (Receiver) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Exchange deposit address"
                    value={formData.exchange_address}
                    onChange={(e) => handleChange('exchange_address', e.target.value)}
                    status={errors.exchange_address ? 'error' : ''}
                  />
                  {errors.exchange_address && <p className="text-xs text-red-500">{errors.exchange_address}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Deposit TxHash <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Transaction hash from exchange UI"
                    value={formData.tx_hash}
                    onChange={(e) => handleChange('tx_hash', e.target.value)}
                    status={errors.tx_hash || validationResults.tx_hash?.result === 2 ? 'error' : ''}
                  />
                  {errors.tx_hash && <p className="text-xs text-red-500">{errors.tx_hash}</p>}
                  {!errors.tx_hash && validationResults.tx_hash?.msg && (
                    <p
                      className={`text-xs ${
                        validationResults.tx_hash.result === 2 ? 'text-red-500' : 'text-yellow-500'
                      }`}
                    >
                      {validationResults.tx_hash.msg}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Deposit Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    locale={locale}
                    className={`${inputClass} !flex !w-full`}
                    value={formData.date ? dayjs(formData.date) : null}
                    onChange={(_, dateString) => handleChange('date', dateString as string)}
                    disabledDate={(current) => {
                      return (
                        current &&
                        (current > dayjs().endOf('day') || current < dayjs().subtract(30, 'day').startOf('day'))
                      )
                    }}
                    placeholder="Select Date (within last 30 days)"
                    popupClassName="[&_.ant-picker-panel]:!bg-[#1f1f1f] [&_.ant-picker-header]:!text-white [&_.ant-picker-content_th]:!text-white [&_.ant-picker-cell]:!text-gray-400 [&_.ant-picker-cell-in-view]:!text-white"
                    status={errors.date ? 'error' : ''}
                  />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>
              </StepContainer>

              {/* Step 4 */}
              <StepContainer title="Find Transaction on Blockchain Explorer">
                <div className="mb-4 flex flex-col gap-2">
                  <label className={labelClass}>Open the deposit transaction on the block explorer</label>
                  {explorerUrl ? (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center gap-2 rounded-lg border border-[#FFFFFF1F] bg-[#FFFFFF1F] px-4 leading-[46px] text-white"
                    >
                      <ExternalLink size={14} /> {explorerUrl.replace('https://', '')}
                    </a>
                  ) : (
                    <div className="h-12 rounded-lg border border-[#FFFFFF1F] px-4 leading-[46px] text-[#606067]">
                      Fill Network and Deposit TxHash in Step 3 to view
                    </div>
                  )}
                </div>

                <ScreenshotUpload
                  label="Blockchain Explorer Screenshot"
                  exampleImage="https://static.codatta.io/static/images/deposit_2_1767511761924.png"
                  value={formData.explorer_screenshot}
                  onChange={(v) => handleChange('explorer_screenshot', v)}
                  onShowModal={showImageModal}
                  error={errors.explorer_screenshot}
                />

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    From (Your Wallet Address) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Your wallet address"
                    value={formData.from_address}
                    onChange={(e) => handleChange('from_address', e.target.value)}
                    status={errors.from_address ? 'error' : ''}
                  />
                  {errors.from_address && <p className="text-xs text-red-500">{errors.from_address}</p>}
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    To (Exchange Deposit Address) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Exchange deposit address"
                    value={formData.to_address}
                    onChange={(e) => handleChange('to_address', e.target.value)}
                    status={errors.to_address ? 'error' : ''}
                  />
                  {errors.to_address && <p className="text-xs text-red-500">{errors.to_address}</p>}
                </div>
              </StepContainer>

              {/* Outgoing Transaction */}
              <StepContainer
                title={
                  <div className="flex items-center text-white">
                    Outgoing Transaction
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 mr-1"
                    >
                      <path
                        d="M7.16667 14.3333C3.21467 14.3333 0 11.1187 0 7.16667C0 3.21467 3.21467 0 7.16667 0C11.1187 0 14.3333 3.21467 14.3333 7.16667C14.3333 11.1187 11.1187 14.3333 7.16667 14.3333ZM7.16667 1C3.766 1 1 3.766 1 7.16667C1 10.5673 3.766 13.3333 7.16667 13.3333C10.5673 13.3333 13.3333 10.5673 13.3333 7.16667C13.3333 3.766 10.5673 1 7.16667 1ZM7.66667 10.1667V7.1193C7.66667 6.8433 7.44267 6.6193 7.16667 6.6193C6.89067 6.6193 6.66667 6.8433 6.66667 7.1193V10.1667C6.66667 10.4427 6.89067 10.6667 7.16667 10.6667C7.44267 10.6667 7.66667 10.4427 7.66667 10.1667ZM7.84668 4.83333C7.84668 4.46533 7.54868 4.16667 7.18001 4.16667H7.17334C6.80534 4.16667 6.50993 4.46533 6.50993 4.83333C6.50993 5.20133 6.81201 5.5 7.18001 5.5C7.54801 5.5 7.84668 5.20133 7.84668 4.83333Z"
                        fill="#BBBBBE"
                      />
                    </svg>
                    <span className="text-xs font-normal text-[#BBBBBE]">
                      Outgoing transactions receive higher rewards. Please verify carefully.
                    </span>
                  </div>
                }
              >
                <div className="mb-4 flex flex-col gap-2">
                  <label className={labelClass}>Open outgoing transaction on block explorer</label>
                  {toAddressUrl ? (
                    <a
                      href={toAddressUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 items-center gap-2 rounded-lg border border-[#FFFFFF1F] bg-[#FFFFFF1F] px-4 leading-[46px] text-white"
                    >
                      <ExternalLink size={14} /> {toAddressUrl.replace('https://', '')}
                    </a>
                  ) : (
                    <div className="h-12 rounded-lg border border-[#FFFFFF1F] px-4 leading-[46px] text-[#606067]">
                      Fill Network and Transaction Hash to view
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className={`mb-2 block ${labelClass}`}>Any outgoing transaction with amount &gt; 0?</label>
                  <Radio.Group
                    value={formData.has_outgoing_transaction}
                    onChange={(e: RadioChangeEvent) => handleChange('has_outgoing_transaction', e.target.value)}
                    className="flex gap-5"
                  >
                    <Radio value="yes" className="!text-sm !font-medium !text-white">
                      Yes
                    </Radio>
                    <Radio value="no" className="!text-sm !font-medium !text-white">
                      No
                    </Radio>
                  </Radio.Group>
                  {errors.has_outgoing_transaction && (
                    <p className="mt-1 text-xs text-red-500">{errors.has_outgoing_transaction}</p>
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
                        status={
                          errors.outgoing_transaction_hash || validationResults.outgoing_transaction_hash?.result === 2
                            ? 'error'
                            : ''
                        }
                      />
                      {errors.outgoing_transaction_hash && (
                        <p className="text-xs text-red-500">{errors.outgoing_transaction_hash}</p>
                      )}
                      {!errors.outgoing_transaction_hash && validationResults.outgoing_transaction_hash?.msg && (
                        <p
                          className={`text-xs ${
                            validationResults.outgoing_transaction_hash.result === 2
                              ? 'text-red-500'
                              : 'text-yellow-500'
                          }`}
                        >
                          {validationResults.outgoing_transaction_hash.msg}
                        </p>
                      )}
                    </div>

                    <div className="my-4 flex flex-col gap-2">
                      <label className={labelClass}>Open outgoing transaction on block explorer</label>
                      {outgoingTxUrl ? (
                        <a
                          href={outgoingTxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-12 items-center gap-2 rounded-lg border border-[#FFFFFF1F] bg-[#FFFFFF1F] px-4 leading-[46px] text-white"
                        >
                          <ExternalLink size={14} /> {outgoingTxUrl.replace('https://', '')}
                        </a>
                      ) : (
                        <div className="h-12 rounded-lg border border-[#FFFFFF1F] px-4 leading-[46px] text-[#606067]">
                          Fill Network and Transaction Hash to view
                        </div>
                      )}
                    </div>

                    <ScreenshotUpload
                      label="Transaction Screenshot"
                      exampleImage="https://static.codatta.io/static/images/deposit_4_1767511761924.png"
                      value={formData.outgoing_tx_screenshot}
                      onChange={(v) => handleChange('outgoing_tx_screenshot', v)}
                      onShowModal={showImageModal}
                      error={errors.outgoing_tx_screenshot}
                    />

                    <div className="mt-3 flex flex-col gap-2">
                      <label className={labelClass}>
                        Exchange Deposit Address(From) <span className="text-red-500">*</span>
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
                        Exchange Hot Wallet(To) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        className={inputClass}
                        placeholder="Exchange hot wallet address"
                        value={formData.outgoing_tx_to_address}
                        onChange={(e) => handleChange('outgoing_tx_to_address', e.target.value)}
                        status={
                          errors.outgoing_tx_to_address || validationResults.outgoing_tx_to_address?.result === 2
                            ? 'error'
                            : ''
                        }
                      />
                      {errors.outgoing_tx_to_address && (
                        <p className="text-xs text-red-500">{errors.outgoing_tx_to_address}</p>
                      )}
                      {!errors.outgoing_tx_to_address && validationResults.outgoing_tx_to_address?.msg && (
                        <p
                          className={`text-xs ${
                            validationResults.outgoing_tx_to_address.result === 2 ? 'text-red-500' : 'text-yellow-500'
                          }`}
                        >
                          {validationResults.outgoing_tx_to_address.msg}
                        </p>
                      )}
                    </div>
                  </div>
                )}
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

export default AirdropCexDeposit

// http://localhost:5175/app/frontier/project/AIRDROP_CEX_HOT_WALLET_DEPOSIT/9498244436600105722
