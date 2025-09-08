import DarkSelect from '@/components/mobile-ui/select'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import { Button, message, Popover } from 'antd'
import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageHeaderBack from './page-header-back'
import { ValidationFormData } from '@/views/frontiers/onchain-verify'

export default function ValidationForm(props: {
  submissionId: string
  onVerify: (data: ValidationFormData) => void
  onBack: () => void
}) {
  const { submissionId } = props
  const { onVerify } = props
  const [jsonData, setJsonData] = useState('')
  const [quality, setQuality] = useState<string | undefined>(undefined)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [address, setAddress] = useState('')

  const { info } = useUserStore()

  useEffect(() => {
    const binanceAddress = info?.accounts_data.find((item) => item.wallet_name === 'Binance Wallet')?.account
    setAddress(binanceAddress || '')
  }, [info])

  const isValidJSON = (jsonString: string): boolean => {
    if (!jsonString.trim()) return false
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      return false
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')

    try {
      const parsed = JSON.parse(pastedText)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonData(formatted)
      setJsonError(null)
      e.preventDefault()
    } catch {
      setTimeout(() => {
        handleJsonChange(e.currentTarget.value)
      }, 0)
    }
  }

  const handleJsonChange = (value: string) => {
    setJsonData(value)

    if (value.trim()) {
      try {
        JSON.parse(value)
        setJsonError(null)
      } catch (error) {
        setJsonError('Invalid JSON format')
      }
    } else {
      setJsonError(null)
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const formData = {
      jsonData: JSON.parse(jsonData),
      quality: quality as 'S' | 'A' | 'B' | 'C' | 'D',
      address,
      submissionId
    }

    onVerify(formData)
  }

  const validateForm = (): boolean => {
    if (!jsonData.trim()) {
      message.error('Please paste the JSON data')
      return false
    }

    if (!isValidJSON(jsonData)) {
      message.error('Please enter a valid JSON format')
      return false
    }

    if (!quality) {
      message.error('Please select a quality rating')
      return false
    }

    const isValidEthereumAddress = (address: string): boolean => {
      const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
      return ethereumAddressRegex.test(address)
    }

    if (!isValidEthereumAddress(address)) {
      message.error('Please enter a valid Ethereum wallet address')
      return false
    }

    return true
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  function handleCopyJSON() {
    props.onBack()
  }

  return (
    <>
      <PageHeaderBack title="Verify" onBack={props.onBack} />

      <div className="mx-auto max-w-2xl p-6 text-sm text-[#BBBBBE]">
        {/* JSON Placeholder Section */}
        <div className="mb-5">
          <div className="mb-2 pl-4 text-sm">JSON Placeholder</div>

          {/* Instructional Box */}
          <div className="mb-4 rounded-lg border border-[#875DFF1F]/20 bg-[#875DFF1F]/15 p-4">
            <p className="mb-3">
              No JSON yet? Go to Task List → View JSON to copy the raw payload, then paste it here.
            </p>
            <button
              className="text- block w-full rounded-full bg-[#1C1C26] py-1 font-bold text-primary"
              onClick={handleCopyJSON}
            >
              Copy JSON
            </button>
          </div>

          {/* JSON Input Area */}
          <div className="relative">
            <textarea
              className={`w-full rounded-lg bg-white/5 p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                jsonError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              }`}
              rows={8}
              placeholder="Paste the original submission JSON. Do not edit."
              value={jsonData}
              onChange={(e) => handleJsonChange(e.target.value)}
              onPaste={handlePaste}
            />
            {jsonError && <div className="absolute bottom-2 right-2 text-xs text-red-400">{jsonError}</div>}
            {jsonData && !jsonError && (
              <div className="absolute bottom-2 right-2 text-xs text-green-400">✓ Valid JSON</div>
            )}
          </div>
        </div>

        {/* Quality Info Section */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2 pl-4 text-sm">
            Quality Info
            <Popover
              content={
                <div className="max-w-[240px]">
                  Quality is an official score based on your data task performance, evaluated by AI models and human
                  experts on Codatta. Higher scores typically lead to greater rewards. For more details, visit the
                  Codatta platform.
                </div>
              }
            >
              <Info size={16} className="text-white/30" />
            </Popover>
          </div>

          <DarkSelect
            options={[
              { value: 'S', label: 'S' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
              { value: 'D', label: 'D' }
            ]}
            value={quality}
            placeholder="Select"
            onChange={(value) => setQuality(value as string)}
            title="Quality Info"
            confirmText="Confirm"
            cancelText="Cancel"
          />
        </div>

        {/* Address Hint Section */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 pl-4 text-sm">
            Address Hint
            <Popover
              content={
                <div className="max-w-[240px]">
                  Address auto-detected for verification only — no transactions will be initiated.
                </div>
              }
            >
              <Info size={16} className="text-white/30" />
            </Popover>
          </div>

          <textarea
            className="block w-full rounded-lg bg-white/5 px-4 py-3 text-white"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Ethereum wallet address"
            rows={2}
          />
        </div>

        {/* Verify Button */}
        <Button type="primary" shape="round" size="large" block onClick={handleSubmit}>
          Verify
        </Button>
      </div>
    </>
  )
}
