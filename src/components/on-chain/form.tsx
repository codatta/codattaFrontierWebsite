import { AlertCircle, ChevronDown, InfoIcon, Loader2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'

export interface IFormData {
  submissionJson: object | null
  submissionId: string
  walletAddress: string
  quality: 'S' | 'A' | 'B' | 'C' | 'D' | ''
}

interface FormProps {
  defaultSubmissionId?: string
  defaultWalletAddress?: string
  defaultQuality?: IFormData['quality']
  defaultSubmissionJsonString?: string
  onSubmit: (formData: IFormData) => Promise<void> | void
  title?: string
  onBack?: () => void
}

interface ValidationErrors {
  submissionJson?: string
  submissionId?: string
  walletAddress?: string
  quality?: string
}

interface FormState {
  submissionJsonString: string
  submissionId: string
  walletAddress: string
  quality: IFormData['quality']
}

export default function Form(props: FormProps) {
  const {
    defaultSubmissionId = '',
    defaultWalletAddress = '',
    defaultQuality = '',
    defaultSubmissionJsonString = '',
    onSubmit
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [jsonError, setJsonError] = useState<string | null>(null)

  const [formState, setFormState] = useState<FormState>({
    submissionJsonString: defaultSubmissionJsonString,
    submissionId: defaultSubmissionId,
    walletAddress: defaultWalletAddress,
    quality: defaultQuality
  })

  const parsedSubmissionJson = useMemo(() => {
    if (!formState.submissionJsonString.trim()) return null
    try {
      const parsed = JSON.parse(formState.submissionJsonString)
      if (typeof parsed === 'object' && parsed !== null) return parsed as object
      return null
    } catch {
      return null
    }
  }, [formState.submissionJsonString])

  const isValidJSON = (jsonString: string): boolean => {
    if (!jsonString.trim()) return false
    try {
      const parsed = JSON.parse(jsonString)
      return typeof parsed === 'object' && parsed !== null
    } catch {
      return false
    }
  }

  const handleJsonChange = (value: string) => {
    handleInputChange('submissionJsonString', value)
    if (!value.trim()) {
      setJsonError(null)
      return
    }
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        setJsonError(null)
      } else {
        setJsonError('Must be a JSON object')
      }
    } catch {
      setJsonError('Invalid JSON')
    }
  }

  const isValidWalletAddress = (address: string): boolean => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(address)
  }

  const isValidSubmissionId = (id: string): boolean => {
    return id.trim().length > 0
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!isValidJSON(formState.submissionJsonString)) {
      newErrors.submissionJson = 'Please enter a valid JSON object'
    }

    if (!isValidSubmissionId(formState.submissionId)) {
      newErrors.submissionId = 'Submission ID is required'
    }

    if (!formState.walletAddress.trim() || !isValidWalletAddress(formState.walletAddress)) {
      newErrors.walletAddress = 'Please enter a valid wallet address (0x format)'
    }

    if (!formState.quality) {
      newErrors.quality = 'Quality is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }))

    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field as keyof ValidationErrors]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSubmit({
        submissionId: formState.submissionId,
        walletAddress: formState.walletAddress,
        quality: formState.quality,
        submissionJson: parsedSubmissionJson
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = Boolean(
    parsedSubmissionJson &&
      isValidSubmissionId(formState.submissionId) &&
      formState.quality &&
      isValidWalletAddress(formState.walletAddress)
  )

  return (
    <div className="min-h-screen bg-white text-black">
      <form onSubmit={handleSubmit} className="px-5 pb-12 pt-2">
        {/* JSON */}
        <div className="mb-7">
          <div className="mb-2 text-[13px] font-semibold text-[#999]">JSON</div>
          <div
            className={[
              'rounded-3xl bg-[#F5F5F5] p-4',
              errors.submissionJson ? 'ring-1 ring-[#FF3B30]' : 'ring-1 ring-transparent'
            ].join(' ')}
          >
            <textarea
              value={formState.submissionJsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Paste the original submission JSON. Do not edit."
              className="h-[120px] w-full resize-none bg-transparent text-[15px] leading-6 text-black outline-none placeholder:text-[#C7C7C7]"
            />
            {jsonError ? <div className="mt-2 text-[12px] text-[#FF3B30]">{jsonError}</div> : null}
          </div>
          {errors.submissionJson ? (
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#FF3B30]">
              <AlertCircle className="size-4" />
              <span>{errors.submissionJson}</span>
            </div>
          ) : null}
        </div>

        {/* Submission ID */}
        <div className="mb-7">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#999]">Submission ID</div>
          </div>

          <div
            className={[
              'rounded-full bg-[#F5F5F5] p-4',
              errors.submissionId ? 'ring-1 ring-[#FF3B30]' : 'ring-1 ring-transparent'
            ].join(' ')}
          >
            <input
              value={formState.submissionId}
              onChange={(e) => handleInputChange('submissionId', e.target.value)}
              placeholder="e.g. 2025082903351000xxxxxx"
              className="w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#C7C7C7]"
            />
          </div>

          {errors.submissionId ? (
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#FF3B30]">
              <AlertCircle className="size-4" />
              <span>{errors.submissionId}</span>
            </div>
          ) : null}
        </div>

        {/* Quality */}
        <div className="mb-7">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#999]">Quality Info</div>
          </div>

          <div
            className={[
              'relative rounded-full bg-[#F5F5F5] px-4 py-4',
              errors.quality ? 'ring-1 ring-[#FF3B30]' : 'ring-1 ring-transparent'
            ].join(' ')}
          >
            <select
              value={formState.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full appearance-none bg-transparent text-[15px] text-black outline-none"
            >
              <option value="">Select</option>
              <option value="S">S</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#C7C7C7]">
              <ChevronDown className="size-5" />
            </div>
          </div>

          {errors.quality ? (
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#FF3B30]">
              <AlertCircle className="size-4" />
              <span>{errors.quality}</span>
            </div>
          ) : null}
        </div>

        {/* Wallet address */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[13px] font-semibold text-[#999]">Wallet Address</div>
          </div>
          <div
            className={[
              'rounded-full bg-[#F5F5F5] p-4',
              errors.walletAddress ? 'ring-1 ring-[#FF3B30]' : 'ring-1 ring-transparent'
            ].join(' ')}
          >
            <input
              value={formState.walletAddress}
              onChange={(e) => handleInputChange('walletAddress', e.target.value)}
              placeholder="0x..."
              className="w-full bg-transparent text-[15px] text-black outline-none placeholder:text-[#C7C7C7]"
            />
          </div>
          {errors.walletAddress ? (
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#FF3B30]">
              <AlertCircle className="size-4" />
              <span>{errors.walletAddress}</span>
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading || !canSubmit}
          className="flex h-14 w-full items-center justify-center rounded-full bg-black text-[17px] font-semibold text-white disabled:opacity-40"
        >
          {isLoading ? <Loader2 className="size-5 animate-spin" /> : 'Verify'}
        </button>
      </form>
    </div>
  )
}
