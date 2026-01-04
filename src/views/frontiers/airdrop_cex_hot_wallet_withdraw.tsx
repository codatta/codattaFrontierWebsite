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
import { SupportedNetworksTip } from '@/components/frontier/airdrop/cex-hot-wallet/supported-networks-tip'
import { WithdrawFormData } from '@/components/frontier/airdrop/cex-hot-wallet/types'
import { ExpertRedline } from '@/components/frontier/airdrop/knob/guideline'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import { ConfigProvider, DatePicker, Input, message, Modal, Select, Spin, theme } from 'antd'
import locale from 'antd/es/date-picker/locale/en_US'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'

const { Option } = Select

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
                    value={formData.exchangeName || undefined}
                    onChange={(value) => handleChange('exchangeName', value)}
                  >
                    {Object.keys(EXCHANGE_URLS).map((ex) => (
                      <Option key={ex} value={ex}>
                        {ex}
                      </Option>
                    ))}
                  </Select>
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
                    <label className={`mb-1 block ${labelClass}`}>Withdrawal history URL</label>
                    <a
                      href={withdrawHistoryUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 rounded-lg border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-[13px] font-semibold text-sky-300 transition-all ${
                        !withdrawHistoryUrl
                          ? 'pointer-events-none opacity-70'
                          : 'hover:bg-sky-400/20 hover:text-sky-100'
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
                    <SupportedNetworksTip />
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
                    <label className={labelClass}>
                      Network <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select network"
                      value={formData.withdrawNetwork || undefined}
                      onChange={(value) => handleChange('withdrawNetwork', value)}
                    >
                      {Object.keys(NETWORK_COIN_OPTIONS).map((net) => (
                        <Option key={net} value={net}>
                          {net}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Coin <span className="text-red-500">*</span>
                    </label>
                    <Select
                      className={selectClass}
                      popupClassName="[&_.ant-select-dropdown]:!bg-[#1f1f1f] [&_.ant-select-item]:!text-white"
                      placeholder="Select coin"
                      value={formData.withdrawCoin || undefined}
                      onChange={(value) => handleChange('withdrawCoin', value)}
                      disabled={!formData.withdrawNetwork}
                    >
                      {coinOptions.map((t) => (
                        <Option key={t} value={t}>
                          {t}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Withdraw Amount <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Exact withdrawal amount from the record"
                      value={formData.withdrawAmount}
                      onChange={(e) => handleChange('withdrawAmount', e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>
                      Network Fee <span className="text-red-500">*</span>
                    </label>
                    <Input
                      className={inputClass}
                      placeholder="Network fee / withdrawal fee"
                      value={formData.withdrawNetworkFee}
                      onChange={(e) => handleChange('withdrawNetworkFee', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Your Withdrawal Wallet Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Your wallet address that received the withdrawal"
                    value={formData.withdrawalAddress}
                    onChange={(e) => handleChange('withdrawalAddress', e.target.value)}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Transaction Hash (TxHash) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Transaction hash from the exchange"
                    value={formData.withdrawalTxHash}
                    onChange={(e) => handleChange('withdrawalTxHash', e.target.value)}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Transaction Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    locale={locale}
                    className={`${inputClass} !flex !w-full`}
                    value={formData.transactionDate ? dayjs(formData.transactionDate) : null}
                    onChange={(_, dateString) => handleChange('transactionDate', dateString as string)}
                    maxDate={dayjs()}
                    minDate={dayjs().subtract(30, 'day')}
                    popupClassName="[&_.ant-picker-panel]:!bg-[#1f1f1f] [&_.ant-picker-header]:!text-white [&_.ant-picker-content_th]:!text-white [&_.ant-picker-cell]:!text-gray-400 [&_.ant-picker-cell-in-view]:!text-white"
                  />
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
                  value={formData.explorerScreenshot}
                  onChange={(v) => handleChange('explorerScreenshot', v)}
                  onShowModal={showImageModal}
                  hint="Full-page screenshot including: URL, TxHash, From address, and To address."
                />

                <div className="mt-3 flex flex-col gap-2">
                  <label className={labelClass}>
                    Sender Address (From) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    className={inputClass}
                    placeholder="Hot wallet address that sent the funds"
                    value={formData.senderAddress}
                    onChange={(e) => handleChange('senderAddress', e.target.value)}
                  />
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

              <div className="mt-12 flex justify-center pb-20">
                <Button
                  disabled={!validateForm()}
                  onClick={handleSubmit}
                  loading={submitting}
                  className={`h-[44px] w-full rounded-full text-base font-bold ${
                    !validateForm() ? 'opacity-50' : ''
                  } md:mx-auto md:w-[240px]`}
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
