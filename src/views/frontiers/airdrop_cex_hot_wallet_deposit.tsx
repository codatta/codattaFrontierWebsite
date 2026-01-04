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
import { DepositFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { message, Modal, Spin } from 'antd'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const AirdropCexDeposit: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // Form State
  const [formData, setFormData] = useState<DepositFormData>({
    exchangeName: '',
    depositScreenshot: [],
    depositNetwork: '',
    depositToken: '',
    depositAmount: '',
    depositDate: '',
    exchangeDepositAddress: '',
    depositTxHash: '',
    explorerScreenshot: [],
    depositFromAddress: '',
    depositToAddress: '',
    hasOutgoingTransaction: null,
    outgoingTransactionScreenshot: [],
    outgoingTransactionHash: '',
    outgoingTxScreenshot: [],
    outgoingTxFromAddress: '',
    outgoingTxToAddress: ''
  })

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
    if (formData.exchangeName) {
      setExchangeUrl(EXCHANGE_URLS[formData.exchangeName] || '')
      setDepositHistoryUrl(DEPOSIT_HISTORY_URLS[formData.exchangeName] || '')
    }
  }, [formData.exchangeName])

  useEffect(() => {
    if (formData.depositNetwork) {
      setTokenOptions(NETWORK_TOKEN_OPTIONS[formData.depositNetwork] || [])
    }
  }, [formData.depositNetwork])

  useEffect(() => {
    if (formData.depositNetwork && formData.depositTxHash) {
      const url = EXPLORER_URLS[formData.depositNetwork]?.replace('{tx}', formData.depositTxHash)
      setExplorerUrl(url || '')
    } else {
      setExplorerUrl('')
    }
  }, [formData.depositNetwork, formData.depositTxHash])

  useEffect(() => {
    if (formData.depositNetwork && formData.depositToAddress) {
      const url = EXPLORER_ADDRESS_URLS[formData.depositNetwork]?.replace('{address}', formData.depositToAddress)
      setToAddressUrl(url || '')
    } else {
      setToAddressUrl('')
    }
  }, [formData.depositNetwork, formData.depositToAddress])

  useEffect(() => {
    if (formData.depositNetwork && formData.outgoingTransactionHash) {
      const url = EXPLORER_URLS[formData.depositNetwork]?.replace('{tx}', formData.outgoingTransactionHash)
      setOutgoingTxUrl(url || '')
    } else {
      setOutgoingTxUrl('')
    }
  }, [formData.depositNetwork, formData.outgoingTransactionHash])

  // Handlers
  const handleChange = <K extends keyof DepositFormData>(field: K, value: DepositFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  const validateForm = () => {
    const required = [
      formData.exchangeName,
      formData.depositScreenshot.length > 0,
      formData.depositNetwork,
      formData.depositToken,
      formData.depositAmount,
      formData.depositDate,
      formData.exchangeDepositAddress,
      formData.depositTxHash,
      formData.explorerScreenshot.length > 0,
      formData.depositFromAddress,
      formData.depositToAddress,
      formData.hasOutgoingTransaction
    ]

    if (required.some((v) => !v)) return false

    if (formData.hasOutgoingTransaction === 'yes') {
      const outgoingRequired = [
        formData.outgoingTransactionScreenshot.length > 0,
        formData.outgoingTransactionHash,
        formData.outgoingTxScreenshot.length > 0,
        formData.outgoingTxFromAddress,
        formData.outgoingTxToAddress
      ]
      if (outgoingRequired.some((v) => !v)) return false
    }

    // Date validation
    const date = new Date(formData.depositDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 30) return false

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please complete all required fields correctly.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        task_type: 'deposit',
        deposit: {
          exchange_name: formData.exchangeName,
          exchange_ui_screenshot_file: formData.depositScreenshot[0]?.fileName,
          exchange_ui_screenshot_hash: formData.depositScreenshot[0]?.hash,
          exchange_ui_screenshot_url: formData.depositScreenshot[0]?.url,
          network: formData.depositNetwork,
          token: formData.depositToken,
          deposit_amount: formData.depositAmount,
          deposit_date: formData.depositDate,
          exchange_deposit_address: formData.exchangeDepositAddress,
          deposit_txhash: formData.depositTxHash,
          explorer_screenshot_file: formData.explorerScreenshot[0]?.fileName,
          explorer_screenshot_hash: formData.explorerScreenshot[0]?.hash,
          explorer_screenshot_url: formData.explorerScreenshot[0]?.url,
          from_address: formData.depositFromAddress,
          to_address: formData.depositToAddress,
          has_outgoing_transaction: formData.hasOutgoingTransaction === 'yes',
          ...(formData.hasOutgoingTransaction === 'yes'
            ? {
                outgoing_transaction_screenshot_file: formData.outgoingTransactionScreenshot[0]?.fileName,
                outgoing_transaction_screenshot_hash: formData.outgoingTransactionScreenshot[0]?.hash,
                outgoing_transaction_screenshot_url: formData.outgoingTransactionScreenshot[0]?.url,
                outgoing_transaction_hash: formData.outgoingTransactionHash,
                outgoing_tx_screenshot_file: formData.outgoingTxScreenshot[0]?.fileName,
                outgoing_tx_screenshot_hash: formData.outgoingTxScreenshot[0]?.hash,
                outgoing_tx_screenshot_url: formData.outgoingTxScreenshot[0]?.url,
                outgoing_tx_from_address: formData.outgoingTxFromAddress,
                outgoing_tx_to_address: formData.outgoingTxToAddress
              }
            : {})
        },
        submitted_at: Date.now()
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
    'w-full rounded-lg border border-[#8b5cf64d] bg-black/40 px-3 py-2.5 text-[13px] text-white outline-none transition-all focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] placeholder:text-[#666]'

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen bg-[#111] py-3 text-white md:py-8">
          {/* Header */}
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1200px] items-center justify-between px-6 text-center text-base font-bold">
              <div
                className="flex cursor-pointer items-center gap-2 text-sm font-normal text-white hover:opacity-80"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} /> Back
              </div>
              <span className="bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                CEX Deposit Hot Wallet Collection
              </span>
              <span className="w-[60px]"></span>
            </h1>
          </div>

          <div className="mt-8 bg-[#FFFFFF0A] py-2">
            <div className="mx-auto max-w-[1200px] px-6">
              <DepositGuideline />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[1200px] px-6 pb-20">
            {/* Step 1 */}
            <StepContainer step={1} title="Confirm Exchange">
              <div className="mb-3 text-[13px] text-white">
                Select the exchange where you have deposit records. Ensure deposits are enabled for required networks
                and tokens.
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Exchange Name <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClass}
                  value={formData.exchangeName}
                  onChange={(e) => handleChange('exchangeName', e.target.value)}
                >
                  <option value="">Select exchange</option>
                  {Object.keys(EXCHANGE_URLS).map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>
            </StepContainer>

            {/* Step 2 */}
            <StepContainer step={2} title="Navigate to Deposit History Page">
              <div className="mb-3 text-[13px] text-white">Navigate to the deposit history page on your exchange.</div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">Official website</label>
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
                  <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">Deposit history URL</label>
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
                </div>
              }
            >
              <ScreenshotUpload
                label="Exchange UI Screenshot"
                exampleImage="https://static.codatta.io/static/images/deposit_1_1767511761924.png"
                value={formData.depositScreenshot}
                onChange={(v) => handleChange('depositScreenshot', v)}
                onShowModal={showImageModal}
                hint="Full-page screenshot including: URL, exchange logo, deposit address, token, amount, and TxHash."
              />

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Network <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={inputClass}
                    value={formData.depositNetwork}
                    onChange={(e) => handleChange('depositNetwork', e.target.value)}
                  >
                    <option value="">Select network</option>
                    {Object.keys(NETWORK_TOKEN_OPTIONS).map((net) => (
                      <option key={net} value={net}>
                        {net}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Token <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={inputClass}
                    value={formData.depositToken}
                    onChange={(e) => handleChange('depositToken', e.target.value)}
                    disabled={!formData.depositNetwork}
                  >
                    <option value="">Select token</option>
                    {tokenOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Deposit Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Deposit amount"
                    value={formData.depositAmount}
                    onChange={(e) => handleChange('depositAmount', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Exchange Deposit Address (Receiver) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Exchange deposit address"
                  value={formData.exchangeDepositAddress}
                  onChange={(e) => handleChange('exchangeDepositAddress', e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Deposit TxHash <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Transaction hash from exchange UI"
                  value={formData.depositTxHash}
                  onChange={(e) => handleChange('depositTxHash', e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Deposit Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                  value={formData.depositDate}
                  onChange={(e) => handleChange('depositDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]}
                />
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
                value={formData.explorerScreenshot}
                onChange={(v) => handleChange('explorerScreenshot', v)}
                onShowModal={showImageModal}
                hint="Full-page screenshot including: URL, TxHash, From address, and To address."
              />

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  From (Your Wallet Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Your wallet address"
                  value={formData.depositFromAddress}
                  onChange={(e) => handleChange('depositFromAddress', e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  To (Exchange Deposit Address) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Exchange deposit address"
                  value={formData.depositToAddress}
                  onChange={(e) => handleChange('depositToAddress', e.target.value)}
                />
              </div>
            </StepContainer>

            {/* Step 5 */}
            <StepContainer step={5} title="Check if Deposit Address Has Outgoing Transactions">
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
                <span className="text-[13px] text-white">Any outgoing transaction with amount &gt; 0?</span>
                <label className="flex cursor-pointer items-center gap-2 text-[#d0d0d0]">
                  <input
                    type="radio"
                    name="hasOutgoing"
                    className="size-4"
                    checked={formData.hasOutgoingTransaction === 'yes'}
                    onChange={() => handleChange('hasOutgoingTransaction', 'yes')}
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[#d0d0d0]">
                  <input
                    type="radio"
                    name="hasOutgoing"
                    className="size-4"
                    checked={formData.hasOutgoingTransaction === 'no'}
                    onChange={() => handleChange('hasOutgoingTransaction', 'no')}
                  />
                  No
                </label>
              </div>

              {formData.hasOutgoingTransaction === 'yes' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <ScreenshotUpload
                    label="Transaction Screenshot"
                    exampleImage="https://static.codatta.io/static/images/deposit_3_1767511761924.png"
                    value={formData.outgoingTransactionScreenshot}
                    onChange={(v) => handleChange('outgoingTransactionScreenshot', v)}
                    onShowModal={showImageModal}
                    hint="Full-page screenshot including: URL, TxHash, From/To addresses, and amount."
                  />
                  <div className="mt-3 flex flex-col gap-2">
                    <label className="text-[13px] font-semibold text-[#d0d0d0]">
                      Transaction Hash <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Outgoing transaction hash"
                      value={formData.outgoingTransactionHash}
                      onChange={(e) => handleChange('outgoingTransactionHash', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </StepContainer>

            {/* Step 6 */}
            {formData.hasOutgoingTransaction === 'yes' && (
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
                  value={formData.outgoingTxScreenshot}
                  onChange={(v) => handleChange('outgoingTxScreenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, TxHash, From address, and To address."
                />

                <div className="mt-3 flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    From (Exchange Deposit Address) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Exchange deposit address"
                    value={formData.outgoingTxFromAddress}
                    onChange={(e) => handleChange('outgoingTxFromAddress', e.target.value)}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    To (Exchange Hot Wallet) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Exchange hot wallet address"
                    value={formData.outgoingTxToAddress}
                    onChange={(e) => handleChange('outgoingTxToAddress', e.target.value)}
                  />
                </div>
              </StepContainer>
            )}

            <div className="mt-12 bg-[#D92B2B0A]">
              <div className="mx-auto max-w-[1320px] px-6">
                <ExpertRedline />
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Button
                disabled={!validateForm()}
                onClick={handleSubmit}
                loading={submitting}
                className={`h-[44px] w-full rounded-full text-base font-bold md:w-[280px] ${
                  !validateForm() ? 'opacity-50' : ''
                }`}
                text="Submit Deposit Task"
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
    </AuthChecker>
  )
}

export default AirdropCexDeposit

// http://localhost:5175/app/frontier/project/AIRDROP_CEX_HOT_WALLET_DEPOSIT/9498244436600105722
