import frontiterApi from '@/apis/frontiter.api'
import AuthChecker from '@/components/app/auth-checker'
import { Button } from '@/components/booster/button'
import {
  EXCHANGE_URLS,
  EXPLORER_URLS,
  NETWORK_COIN_OPTIONS,
  WITHDRAWAL_HISTORY_URLS
} from '@/components/frontier/airdrop/cex-hot-wallet/constants'
import { WithdrawGuideline } from '@/components/frontier/airdrop/cex-hot-wallet/guideline'
import { ScreenshotUpload } from '@/components/frontier/airdrop/cex-hot-wallet/screenshot-upload'
import { StepContainer } from '@/components/frontier/airdrop/cex-hot-wallet/step-container'
import { WithdrawFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { message, Modal, Spin } from 'antd'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const AirdropCexWithdraw: React.FC<{ templateId?: string }> = ({ templateId: propTemplateId }) => {
  const { taskId, templateId: paramTemplateId } = useParams()
  const templateId = propTemplateId || paramTemplateId

  // Form State
  const [formData, setFormData] = useState<WithdrawFormData>({
    exchangeName: '',
    exchangeScreenshot: [],
    withdrawNetwork: '',
    withdrawCoin: '',
    withdrawAmount: '',
    withdrawNetworkFee: '',
    withdrawalAddress: '',
    withdrawalTxHash: '',
    transactionDate: '',
    explorerScreenshot: [],
    senderAddress: '',
    receiverAddress: ''
  })

  // UI State
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState('')

  // Derived State
  const [exchangeUrl, setExchangeUrl] = useState('')
  const [withdrawHistoryUrl, setWithdrawHistoryUrl] = useState('')
  const [explorerUrl, setExplorerUrl] = useState('')
  const [coinOptions, setCoinOptions] = useState<string[]>([])

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) return
    setLoading(true)
    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId)
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

  useEffect(() => {
    if (formData.exchangeName) {
      setExchangeUrl(EXCHANGE_URLS[formData.exchangeName] || '')
      setWithdrawHistoryUrl(WITHDRAWAL_HISTORY_URLS[formData.exchangeName] || '')
    }
  }, [formData.exchangeName])

  useEffect(() => {
    if (formData.withdrawNetwork) {
      setCoinOptions(NETWORK_COIN_OPTIONS[formData.withdrawNetwork] || [])
    }
  }, [formData.withdrawNetwork])

  useEffect(() => {
    if (formData.withdrawNetwork && formData.withdrawalTxHash) {
      const url = EXPLORER_URLS[formData.withdrawNetwork]?.replace('{tx}', formData.withdrawalTxHash)
      setExplorerUrl(url || '')
    } else {
      setExplorerUrl('')
    }
  }, [formData.withdrawNetwork, formData.withdrawalTxHash])

  const handleChange = <K extends keyof WithdrawFormData>(field: K, value: WithdrawFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const showImageModal = (src: string) => {
    setModalImageSrc(src)
    setImageModalVisible(true)
  }

  const validateForm = () => {
    const required = [
      formData.exchangeName,
      formData.exchangeScreenshot.length > 0,
      formData.withdrawNetwork,
      formData.withdrawCoin,
      formData.withdrawAmount,
      formData.withdrawNetworkFee,
      formData.withdrawalAddress,
      formData.withdrawalTxHash,
      formData.transactionDate,
      formData.explorerScreenshot.length > 0,
      formData.senderAddress,
      formData.receiverAddress
    ]

    if (required.some((v) => !v)) return false

    // Date validation
    const date = new Date(formData.transactionDate)
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
        task_type: 'withdrawal',
        withdrawal: {
          exchange_name: formData.exchangeName,
          exchange_ui_screenshot_file: formData.exchangeScreenshot[0]?.fileName,
          exchange_ui_screenshot_hash: formData.exchangeScreenshot[0]?.hash,
          exchange_ui_screenshot_url: formData.exchangeScreenshot[0]?.url,
          network: formData.withdrawNetwork,
          coin: formData.withdrawCoin,
          withdraw_amount: formData.withdrawAmount,
          network_fee: formData.withdrawNetworkFee,
          withdrawal_address: formData.withdrawalAddress,
          withdrawal_txhash: formData.withdrawalTxHash,
          transaction_date: formData.transactionDate,
          explorer_screenshot_file: formData.explorerScreenshot[0]?.fileName,
          explorer_screenshot_hash: formData.explorerScreenshot[0]?.hash,
          explorer_screenshot_url: formData.explorerScreenshot[0]?.url,
          sender_address: formData.senderAddress,
          receiver_address: formData.receiverAddress
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

  const inputClass =
    'w-full rounded-lg border border-[#8b5cf64d] bg-black/40 px-3 py-2.5 text-[13px] text-white outline-none transition-all focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] placeholder:text-[#666]'

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen bg-[#111] py-3 text-white md:py-8">
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1200px] items-center justify-between px-6 text-center text-base font-bold">
              <div
                className="flex cursor-pointer items-center gap-2 text-sm font-normal text-white hover:opacity-80"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} /> Back
              </div>
              <span className="bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                CEX Withdrawal Hot Wallet Collection
              </span>
              <span className="w-[60px]"></span>
            </h1>
          </div>

          <div className="mt-8 bg-[#FFFFFF0A] py-2">
            <div className="mx-auto max-w-[1200px] px-6">
              <WithdrawGuideline />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-[1200px] px-6 pb-20">
            {/* Step 1 */}
            <StepContainer step={1} title="Confirm Exchange">
              <div className="mb-3 text-[13px] text-white">
                Select the exchange where you have withdrawal records. Ensure withdrawals are enabled for required
                networks and tokens.
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
            <StepContainer step={2} title="Navigate to Withdrawal History Page">
              <div className="mb-3 text-[13px] text-white">
                Navigate to the withdrawal history page on your exchange.
              </div>
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
                  <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">Withdrawal history URL</label>
                  <a
                    href={withdrawHistoryUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                      !withdrawHistoryUrl ? 'pointer-events-none opacity-70' : 'hover:bg-sky-400/20 hover:text-sky-100'
                    }`}
                  >
                    {withdrawHistoryUrl ? (
                      <>
                        <ExternalLink size={14} /> {withdrawHistoryUrl.replace('https://', '')}
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
                </div>
              }
            >
              <ScreenshotUpload
                label="Exchange UI Screenshot"
                exampleImage="https://static.codatta.io/static/images/withdraw_1_1767511761924.png"
                value={formData.exchangeScreenshot}
                onChange={(v) => handleChange('exchangeScreenshot', v)}
                onShowModal={showImageModal}
                hint="Full-page screenshot including: URL, exchange logo, withdrawal address, token, amount, date/time, and TxHash."
              />

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Network <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={inputClass}
                    value={formData.withdrawNetwork}
                    onChange={(e) => handleChange('withdrawNetwork', e.target.value)}
                  >
                    <option value="">Select network</option>
                    {Object.keys(NETWORK_COIN_OPTIONS).map((net) => (
                      <option key={net} value={net}>
                        {net}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Coin <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={inputClass}
                    value={formData.withdrawCoin}
                    onChange={(e) => handleChange('withdrawCoin', e.target.value)}
                    disabled={!formData.withdrawNetwork}
                  >
                    <option value="">Select coin</option>
                    {coinOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Withdraw Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Exact withdrawal amount from the record"
                    value={formData.withdrawAmount}
                    onChange={(e) => handleChange('withdrawAmount', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-[#d0d0d0]">
                    Network Fee <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Network fee / withdrawal fee"
                    value={formData.withdrawNetworkFee}
                    onChange={(e) => handleChange('withdrawNetworkFee', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Your Withdrawal Wallet Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Your wallet address that received the withdrawal"
                  value={formData.withdrawalAddress}
                  onChange={(e) => handleChange('withdrawalAddress', e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Transaction Hash (TxHash) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Transaction hash from the exchange"
                  value={formData.withdrawalTxHash}
                  onChange={(e) => handleChange('withdrawalTxHash', e.target.value)}
                />
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`${inputClass} [color-scheme:dark]`}
                  value={formData.transactionDate}
                  onChange={(e) => handleChange('transactionDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]}
                />
              </div>
            </StepContainer>

            {/* Step 4 */}
            <StepContainer step={4} title="Find Transaction on Blockchain Explorer">
              <div className="mb-4">
                <label className="mb-1 block text-[13px] font-semibold text-[#d0d0d0]">
                  Open this transaction on block explorer
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
                    '(Fill Network and Transaction Hash in Step 3 to view)'
                  )}
                </a>
              </div>

              <ScreenshotUpload
                label="Blockchain Explorer Screenshot"
                exampleImage="https://static.codatta.io/static/images/withdraw_2_1767511761924.png"
                value={formData.explorerScreenshot}
                onChange={(v) => handleChange('explorerScreenshot', v)}
                onShowModal={showImageModal}
                hint="Full-page screenshot including: URL, TxHash, From address, and To address."
              />

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Sender Address (From) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Hot wallet address that sent the funds"
                  value={formData.senderAddress}
                  onChange={(e) => handleChange('senderAddress', e.target.value)}
                />
                <div className="text-[11px] text-[#888]">This is the hot wallet address controlled by the exchange</div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#d0d0d0]">
                  Receiver Address (To) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Your wallet address that received the funds"
                  value={formData.receiverAddress}
                  onChange={(e) => handleChange('receiverAddress', e.target.value)}
                />
              </div>
            </StepContainer>

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
                text="Submit Withdrawal Task"
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

export default AirdropCexWithdraw

// http://localhost:5175/app/frontier/project/AIRDROP_CEX_HOT_WALLET_WITHDRAW/9498241470700105721
